try {
    console.info = new Proxy(console.info, {
        apply: (target, thisArg, args) => {
            if (args?.[0]?.includes?.("React DevTools")) return;
            return Reflect.apply(target, thisArg, args);
        },
    });
} catch { }