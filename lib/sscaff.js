"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sscaff = void 0;
const fs_1 = require("fs");
const path = require("path");
const substitute_1 = require("./substitute");
const hooksFile = '.hooks.sscaff.js';
/**
 * Copy all files from `templateDir` to `targetDir` and substitute all variables
 * in file names and their contents. Substitutions take the form `{{ key }}`.
 *
 * @param sourceDir
 * @param targetDir
 * @param variables
 */
async function sscaff(sourceDir, targetDir, variables = {}) {
    sourceDir = path.resolve(sourceDir);
    targetDir = path.resolve(targetDir);
    await fs_1.promises.mkdir(targetDir, { recursive: true });
    const hooks = loadHooks();
    if (!variables.$base) {
        variables.$base = path.basename(targetDir);
    }
    const restore = process.cwd();
    try {
        process.chdir(targetDir);
        await executePreHook();
        await processDirectory('.');
        await executePostHook();
    }
    finally {
        process.chdir(restore);
    }
    async function processDirectory(subdir) {
        const subPath = path.join(sourceDir, subdir);
        for (const file of await fs_1.promises.readdir(subPath)) {
            if (file === hooksFile) {
                continue;
            }
            const sourcePath = path.join(subPath, file);
            if ((await fs_1.promises.stat(sourcePath)).isDirectory()) {
                await processDirectory(path.join(subdir, file));
                continue;
            }
            const targetPath = substitute_1.substitute(path.join(subdir, file), variables);
            const input = await fs_1.promises.readFile(sourcePath, 'utf-8');
            const output = substitute_1.substitute(input.toString(), variables);
            await fs_1.promises.mkdir(path.dirname(targetPath), { recursive: true });
            await fs_1.promises.writeFile(targetPath, output);
        }
    }
    async function executePreHook() {
        if (!(hooks === null || hooks === void 0 ? void 0 : hooks.pre)) {
            return;
        }
        await Promise.resolve(hooks.pre(variables));
    }
    async function executePostHook() {
        if (!(hooks === null || hooks === void 0 ? void 0 : hooks.post)) {
            return;
        }
        await Promise.resolve(hooks.post(variables));
    }
    function loadHooks() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            return require(path.join(sourceDir, hooksFile));
        }
        catch (_a) {
            return undefined;
        }
    }
}
exports.sscaff = sscaff;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NjYWZmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3NjYWZmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJCQUFvQztBQUNwQyw2QkFBNkI7QUFDN0IsNkNBQTBDO0FBRTFDLE1BQU0sU0FBUyxHQUFHLGtCQUFrQixDQUFDO0FBRXJDOzs7Ozs7O0dBT0c7QUFDSSxLQUFLLFVBQVUsTUFBTSxDQUFDLFNBQWlCLEVBQUUsU0FBaUIsRUFBRSxZQUF1QyxFQUFHO0lBQzNHLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3BDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRXBDLE1BQU0sYUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUUvQyxNQUFNLEtBQUssR0FBRyxTQUFTLEVBQUUsQ0FBQztJQUUxQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNwQixTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDNUM7SUFFRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDOUIsSUFBSTtRQUNGLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekIsTUFBTSxjQUFjLEVBQUUsQ0FBQztRQUN2QixNQUFNLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sZUFBZSxFQUFFLENBQUM7S0FDekI7WUFBUztRQUNSLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDeEI7SUFFRCxLQUFLLFVBQVUsZ0JBQWdCLENBQUMsTUFBYztRQUM1QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM3QyxLQUFLLE1BQU0sSUFBSSxJQUFJLE1BQU0sYUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUU1QyxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQ3RCLFNBQVM7YUFDVjtZQUVELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTVDLElBQUksQ0FBQyxNQUFNLGFBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtnQkFDN0MsTUFBTSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxTQUFTO2FBQ1Y7WUFFRCxNQUFNLFVBQVUsR0FBRyx1QkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sS0FBSyxHQUFHLE1BQU0sYUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDckQsTUFBTSxNQUFNLEdBQUcsdUJBQVUsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDdkQsTUFBTSxhQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUM5RCxNQUFNLGFBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUVELEtBQUssVUFBVSxjQUFjO1FBQzNCLElBQUksRUFBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsR0FBRyxDQUFBLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFDNUIsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsS0FBSyxVQUFVLGVBQWU7UUFDNUIsSUFBSSxFQUFDLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxJQUFJLENBQUEsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUM3QixNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxTQUFTLFNBQVM7UUFDaEIsSUFBSTtZQUNGLGlFQUFpRTtZQUNqRSxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1NBQ2pEO1FBQUMsV0FBTTtZQUNOLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQztBQUNILENBQUM7QUEvREQsd0JBK0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHJvbWlzZXMgYXMgZnMgfSBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgc3Vic3RpdHV0ZSB9IGZyb20gJy4vc3Vic3RpdHV0ZSc7XG5cbmNvbnN0IGhvb2tzRmlsZSA9ICcuaG9va3Muc3NjYWZmLmpzJztcblxuLyoqXG4gKiBDb3B5IGFsbCBmaWxlcyBmcm9tIGB0ZW1wbGF0ZURpcmAgdG8gYHRhcmdldERpcmAgYW5kIHN1YnN0aXR1dGUgYWxsIHZhcmlhYmxlc1xuICogaW4gZmlsZSBuYW1lcyBhbmQgdGhlaXIgY29udGVudHMuIFN1YnN0aXR1dGlvbnMgdGFrZSB0aGUgZm9ybSBge3sga2V5IH19YC5cbiAqXG4gKiBAcGFyYW0gc291cmNlRGlyXG4gKiBAcGFyYW0gdGFyZ2V0RGlyXG4gKiBAcGFyYW0gdmFyaWFibGVzXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzc2NhZmYoc291cmNlRGlyOiBzdHJpbmcsIHRhcmdldERpcjogc3RyaW5nLCB2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7IH0pIHtcbiAgc291cmNlRGlyID0gcGF0aC5yZXNvbHZlKHNvdXJjZURpcik7XG4gIHRhcmdldERpciA9IHBhdGgucmVzb2x2ZSh0YXJnZXREaXIpO1xuXG4gIGF3YWl0IGZzLm1rZGlyKHRhcmdldERpciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG5cbiAgY29uc3QgaG9va3MgPSBsb2FkSG9va3MoKTtcblxuICBpZiAoIXZhcmlhYmxlcy4kYmFzZSkge1xuICAgIHZhcmlhYmxlcy4kYmFzZSA9IHBhdGguYmFzZW5hbWUodGFyZ2V0RGlyKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3RvcmUgPSBwcm9jZXNzLmN3ZCgpO1xuICB0cnkge1xuICAgIHByb2Nlc3MuY2hkaXIodGFyZ2V0RGlyKTtcbiAgICBhd2FpdCBleGVjdXRlUHJlSG9vaygpO1xuICAgIGF3YWl0IHByb2Nlc3NEaXJlY3RvcnkoJy4nKTtcbiAgICBhd2FpdCBleGVjdXRlUG9zdEhvb2soKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBwcm9jZXNzLmNoZGlyKHJlc3RvcmUpO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc0RpcmVjdG9yeShzdWJkaXI6IHN0cmluZykge1xuICAgIGNvbnN0IHN1YlBhdGggPSBwYXRoLmpvaW4oc291cmNlRGlyLCBzdWJkaXIpO1xuICAgIGZvciAoY29uc3QgZmlsZSBvZiBhd2FpdCBmcy5yZWFkZGlyKHN1YlBhdGgpKSB7XG5cbiAgICAgIGlmIChmaWxlID09PSBob29rc0ZpbGUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNvdXJjZVBhdGggPSBwYXRoLmpvaW4oc3ViUGF0aCwgZmlsZSk7XG5cbiAgICAgIGlmICgoYXdhaXQgZnMuc3RhdChzb3VyY2VQYXRoKSkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICBhd2FpdCBwcm9jZXNzRGlyZWN0b3J5KHBhdGguam9pbihzdWJkaXIsIGZpbGUpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRhcmdldFBhdGggPSBzdWJzdGl0dXRlKHBhdGguam9pbihzdWJkaXIsIGZpbGUpLCB2YXJpYWJsZXMpO1xuICAgICAgY29uc3QgaW5wdXQgPSBhd2FpdCBmcy5yZWFkRmlsZShzb3VyY2VQYXRoLCAndXRmLTgnKTtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHN1YnN0aXR1dGUoaW5wdXQudG9TdHJpbmcoKSwgdmFyaWFibGVzKTtcbiAgICAgIGF3YWl0IGZzLm1rZGlyKHBhdGguZGlybmFtZSh0YXJnZXRQYXRoKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgICBhd2FpdCBmcy53cml0ZUZpbGUodGFyZ2V0UGF0aCwgb3V0cHV0KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBleGVjdXRlUHJlSG9vaygpIHtcbiAgICBpZiAoIWhvb2tzPy5wcmUpIHsgcmV0dXJuOyB9XG4gICAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKGhvb2tzLnByZSh2YXJpYWJsZXMpKTtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGVQb3N0SG9vaygpIHtcbiAgICBpZiAoIWhvb2tzPy5wb3N0KSB7IHJldHVybjsgfVxuICAgIGF3YWl0IFByb21pc2UucmVzb2x2ZShob29rcy5wb3N0KHZhcmlhYmxlcykpO1xuICB9XG5cbiAgZnVuY3Rpb24gbG9hZEhvb2tzKCkge1xuICAgIHRyeSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgcmV0dXJuIHJlcXVpcmUocGF0aC5qb2luKHNvdXJjZURpciwgaG9va3NGaWxlKSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxufVxuXG4iXX0=