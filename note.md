# ts 对 es 模块和 commonjs 模块的支持

1. 不能直接执行 `node a.ts` 因为 `node` 只能执行 `.js` 文件。可以要么用 `tsc` 编译 `.ts` 文件，要么用 `ts-node` 代替 `node` 执行 `.ts` 文件