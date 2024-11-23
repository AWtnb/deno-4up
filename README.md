# README

```
deno run --allow-read --allow-write --allow-import .\main.ts --src .\megane.png --pwidth 30
```

![img](./4up.png)


- 4up selected image file (Suitable for printing in L-format).
    - L-format = 3R = 3.5 x 5 inches
- `--pwidth` parameter specifies the width of each photo (mm).
    - The aspect ratio of each photo is not changed.
- Using [pdf-lib](https://github.com/Hopding/pdf-lib) on [Deno](https://deno.com/).

