import { join } from "jsr:@std/path";
import { existsSync } from "jsr:@std/fs";
import { parseArgs } from "jsr:@std/cli/parse-args";
import { PDFDocument } from "https://cdn.skypack.dev/pdf-lib?dts";

interface ImageDim {
    width: number;
    height: number;
}

const fourup = async (
    src: string,
    pWidth: number,
    isPng: boolean,
): Promise<number> => {
    const outDoc = await PDFDocument.create();
    const imgByteArray = await Deno.readFile(src);
    const img = isPng
        ? await outDoc.embedPng(imgByteArray)
        : await outDoc.embedJpg(imgByteArray);

    // L-format (89x127)
    const w = Math.floor((89 / pWidth) * img.width);
    const h = Math.floor(w * 1.43);
    const page = outDoc.addPage([w, h]);
    const xMargin = Math.floor(w * 0.05);
    const yMargin = Math.floor(h * 0.05);

    [xMargin, w - img.width - xMargin].forEach((x) => {
        [yMargin, h - img.height - yMargin].forEach((y) => {
            page.drawImage(img, {
                x: x,
                y: y,
                width: img.width,
                height: img.height,
            });
        });
    });

    const bytes = await outDoc.save();
    const outPath = join(Deno.cwd(), "4up.pdf");
    await Deno.writeFile(outPath, bytes);

    return 0;
};

const checkPath = (path: string): boolean => {
    return existsSync(path) && [".png", ".jpeg", ".jpg"].some((ext) => {
        return path.toLowerCase().endsWith(ext);
    });
};

const main = async () => {
    const flags = parseArgs(Deno.args, {
        string: ["src", "pwidth"],
        default: {
            src: "",
            pwidth: "30",
        },
    });

    if (!checkPath(flags.src)) {
        console.log("invalid src path.");
        Deno.exit(1);
    }

    const result = await fourup(
        flags.src,
        Number(flags.pwidth),
        flags.src.toLowerCase().endsWith(".png"),
    );
    Deno.exit(result);
};

main();
