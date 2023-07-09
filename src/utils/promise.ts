enum PStatus {
    isPending,
    isFulfulled,
    isRejected
}

interface MyPromiseInce<T>{
    then<TResult1 = T, TResult2 = never>(onfulfilled? : ((value? : T ) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected? : ((reason? : any) => TResult2 | PromiseLike<TResult2>) | null | undefined) : MyPromiseInce<TResult1 | TResult2>;

    catch<TResult = never>(onrejected? : ((reason? : any) => TResult) | null | undefined) : MyPromiseInce<T | TResult>
}

export class MyPromise<T> implements MyPromiseInce<T>{
    private status : PStatus
    value : undefined | T
    reason : undefined | any
    fulfilledCallbacks : Function[]
    rejectedCallbacks : Function[]
    isResolved = false

    constructor(executor : Function){
        this.status = PStatus.isPending
        this.fulfilledCallbacks = []
        this.rejectedCallbacks = []
        const resolve = (value? : T) => {
            if(this.isResolved) return
            this.isResolved = true

            //改变状态
            if(this.status === PStatus.isPending){
                this.status = PStatus.isFulfulled
                this.value = value
                this.fulfilledCallbacks.length && this.fulfilledCallbacks.forEach(callback => callback(this.value))  
            }
        }

        const reject = (reason? : any) => {
            //改变状态
            if(this.status === PStatus.isPending){
                this.status = PStatus.isRejected
                this.reason = reason
                this.rejectedCallbacks && this.rejectedCallbacks.forEach( callback => callback(this.reason))
            }
        }

        try{
            //立即执行一次callback
            executor(resolve, reject)
        }catch(error){
            reject(error)
        }
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value?: T | undefined) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason?: any) => TResult2 | PromiseLike<TResult2>) | null | undefined) : MyPromiseInce<TResult1 | TResult2>{      
        const newPromise = new MyPromise<TResult1 | TResult2>((resolve, reject) => {
            // 接收处理
            const handleFulfilled = (value? : T) => {
                //是函数才执行，onfulfilled和onrejected必须为函数
                if(typeof onfulfilled === "function"){
                    try{
                        //获取回调的返回值，如果value是函数，就获取结果值
                        const result = typeof value === 'function' ? value() :  onfulfilled(value);
                        // console.log("handleReturn " +  result)
                        //如果还是一个promise，就继续递归处理
                        if(result instanceof MyPromise){
                            result.then(resolve, reject)
                        }else{
                        //否则就可以直接resolve了
                            resolve(result as TResult1)
                        }
                    }catch(error){
                        reject(error)
                    }
                }
            }
            //拒绝处理
            const handleRejected = (reason? : any) => {
                if(typeof onrejected === 'function'){
                    try{
                        const result = onrejected(reason);
                        if(result instanceof MyPromise){
                            result.then(resolve, reject)
                        }else{
                            resolve(result as TResult2)
                        }
                    }catch(error){
                        reject(error)
                    }
                }else{
                    reject(reason as TResult2)
                }
            }

            if(this.status === PStatus.isFulfulled){
                // 如果是接收状态
                setTimeout(() => handleFulfilled(this.value), 0);
            }else if(this.status === PStatus.isRejected){
                // 如果是拒绝状态
                setTimeout(() => handleRejected(this.reason), 0);
            }else{
                //此时就是异步状态了，需要填充到回调数组中
                this.fulfilledCallbacks.push(handleFulfilled)
                this.rejectedCallbacks.push(handleRejected)
                // //console.log(this.fulfilledCallbacks.length, this.rejectedCallbacks.length)
            }
        })

        return newPromise;

    }

    catch<TResult = never>(onrejected?: ((reason?: any) => TResult) | null | undefined): MyPromiseInce<T | TResult> {
        return this.then(undefined, onrejected)
    }

}

// const p = new MyPromise((resolve, reject) => {
//     //console.log("constructor enter")
//     setTimeout(()=>{
//         // console.log("settimeout")
//         // throw new Error("handler err")
//         // resolve("haha")
//         try{
//             console.log("settimeout")
//             resolve(()=>{
//                 return "heihei"
//             })
//             // throw new Error("handler err")
//         }catch(error){
//             reject(error)
//         }
//     },0)
// })

// p.then((val) => { 
//     console.log("hello world")
//     setTimeout(() => {
//         console.log("double settimeout")
//     }, 0);
//     return "then callback "  +val
// // })
// }).then((val) => { 
//     console.log("then double")
//     return "then double "  +val
// }).catch((err) =>{
//     console.log("err change " + err)
// })

