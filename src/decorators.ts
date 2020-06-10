export function logTime(_target: object, _funcName: PropertyKey, descriptor: PropertyDescriptor) {
  const originalFunc: Function = descriptor.value;
  let callId = 0;

  function funcWithLogTime(this: object) {
    const currentCallId = callId++;
    const callName = `${originalFunc.name}-${currentCallId}`;
    console.time(callName);
    const value = originalFunc.apply(this, arguments);
    if (typeof value === "object" && typeof value?.then === "function") {
      return (value as Promise<any>).finally(() => {
        console.timeEnd(callName);
      });
    }

    console.timeEnd(callName);
    return value;
  }

  descriptor.value = funcWithLogTime;
}
