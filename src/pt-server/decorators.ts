export function logTime(_target: object, _funcName: PropertyKey, descriptor: PropertyDescriptor) {
  const originalFunc: Function = descriptor.value;
  let callId = 0;

  function funcWithLogTime(this: object) {
    const currentCallId = callId++;
    const callName = `${originalFunc.name}-${currentCallId}`;
    console.time(callName);

    let value;
    try {
      value = originalFunc.apply(this, arguments);
    } catch (error) {
      console.timeEnd(callName);
      throw error;
    }

    if (typeof value?.then === "function") {
      return (value as Promise<any>).finally(() => {
        console.timeEnd(callName);
      });
    }

    console.timeEnd(callName);
    return value;
  }

  descriptor.value = funcWithLogTime;
}
