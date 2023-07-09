// import Promise, { reject } from 'promise'

// const fun = () => {
//     console.log('promise before')
//     new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(()=>{
//                 console.log("promise running")
//             })
//         }, 1000);
//     }).then(()=>{console.log("promise then")})
//     console.log("promise after")

// }

// fun()

// const promiseA = new Promise((resolve, reject) => {
//     resolve(777);
//   });
//   // 此时，“promiseA”已经敲定了
//   promiseA.then((val) => console.log("异步日志记录有值：", val));
//   console.log("立即记录");


const promiseB = new Promise((resolve, reject) => {
    const val = '123'
    try{
        // throw new Error("something went to error")
        // resolve('real val')
        setTimeout(() => {
            console.log("settimeout")
            resolve("hehe")
        }, 1000);
    }catch(e){
        reject('val')
    }
    
    
})

promiseB.then((val) => { 
    console.log("hello world")
    setTimeout(() => {
        console.log("double settimeout")
    }, 0);
    return "then callback "  +val
// })
}).then((val) => { 
    console.log("then double")
    setTimeout(() => {
        console.log("xiaosi")
    }, 0);
    return "then double "  +val
})