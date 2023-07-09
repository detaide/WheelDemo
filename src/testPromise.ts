/*
 * @Author: hyman
 * @Date: 2023-07-09 22:35:22
 * @LastEditors: Dalas
 * @LastEditTime: 2023-07-09 22:56:28
 * @Description: 请填写简介
 */

import { MyPromise } from './utils/promise.ts'
import promisesAplusTests from 'promises-aplus-tests'

function deferred() {
    let resolve: any;
    let reject: any;
    const promise = new MyPromise((res, rej) => {
      resolve = res;
      reject = rej;
    });
  
    return {
      promise,
      resolve,
      reject,
    };
  }
  
  const adapter = {
    deferred,
  };
  
  promisesAplusTests(adapter, (err: any) => {
    if (err) {
      console.error(err);
    } else {
      console.log('所有测试用例已通过');
    }
  });