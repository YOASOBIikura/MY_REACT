import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outDir = path.resolve("outputs", "excel_template");
await fs.mkdir(outDir, { recursive: true });

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("2026年3月CDN");
sheet.showGridLines = true;

const title = "《智算边缘融合内容分发服务系统v1.1》研发月度进度表";
sheet.getRange("A1:I1").merge();
sheet.getRange("A1:I1").values = [[title]];
sheet.getRange("A1:I1").format = {
  font: { bold: true, size: 16, color: "#111827" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};

sheet.getRange("A2:I2").values = [[
  "汇报周期：4月",
  "汇报人：谢金林",
  "汇报日期：2026年4月16日",
  "",
  "",
  "",
  "C",
  "",
  "",
]];
sheet.getRange("A2:I2").format = {
  font: { bold: true, size: 10, color: "#111827" },
  fill: "#F8FAFC",
  verticalAlignment: "center",
};

const headers = [
  "模块分类",
  "具体研发内容",
  "完成状态",
  "完成时间",
  "负责人",
  "迭代完成状态",
  "迭代完成时间",
  "负责人",
  "备注/下一阶段计划",
];
sheet.getRange("A3:I3").values = [headers];
sheet.getRange("A3:I3").format = {
  fill: "#8EA9DB",
  font: { bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};

const rows = [
  ["系统架构搭建", "VUE3前端开发（适配各功能页面）", "已完成", "2025/12/31", "侯文字", "已完成", "2026/3/4", "谢金林", "已适配全站加速、监控等核心系统模块，后续根据接口联调优化交互细节。"],
  ["系统架构搭建", "Java后端开发（核心业务服务）", "已完成", "2025/12/31", "曾昭佑", "已完成", "2026/3/4", "曾昭佑", "支持各模块数据交互与业务流转，预留高并发扩展接口。"],
  ["系统架构搭建", "自建CDN节点端架构", "已完成", "2025/12/28", "谢金林", "已完成", "2026/2/28", "谢金林", "实现配置版本同步、多维度监控上报，为后续调度策略打基础。"],
  ["系统架构搭建", "自建节点加速类型（网页）", "已完成", "2025/12/30", "谢金林", "已完成", "2026/2/25", "谢金林", "下一阶段重点实现直播加速功能，完善加速类型配置项。"],
  ["融合CDN对接", "天翼云CDN API接口对接", "已完成", "2025/12/18", "", "已完成", "", "", "接口稳定运行，可正常调用融合加速能力。"],
  ["融合CDN对接", "网宿CDN API接口对接", "已完成", "2025/12/20", "曾昭佑", "已完成", "", "曾昭佑", "接口联调完毕，纳入融合调度体系。"],
  ["融合CDN对接", "百度云CDN API接口对接", "已完成", "2026/1/18", "", "已完成", "2026/1/18", "", "下一阶段计划测试百度云CDN加速能力与稳定性。"],
  ["全站加速系统", "加速域名管理模块", "已完成", "2025/12/20", "侯文字", "已完成", "", "", "支持域名新增、编辑、停用等全生命周期管理。"],
  ["全站加速系统", "证书管理模块", "已完成", "2025/12/22", "", "已完成", "2026/2/28", "", "实现证书上传、更新、过期提醒功能，保障HTTPS配置。"],
  ["全站加速系统", "刷新预热模块", "已完成", "2026/1/15", "谢金林", "已完成", "2026/2/28", "谢金林", "支持文件/目录刷新、URL预热，提升内容更新效率。"],
  ["全站加速系统", "日志管理模块", "已完成", "2026/1/20", "谢金林", "已完成", "2026/2/28", "谢金林", "实现日志采集、查询、导出功能，支持问题定位。"],
  ["全站加速系统", "套餐管理模块", "已完成", "2025/12/28", "曾昭佑", "已完成", "", "曾昭佑", "支持套餐配置、权限关联，适配不同客户用量模式。"],
  ["监控系统", "实时监控模块（流量/请求数）", "已完成", "2025/12/15", "", "已完成", "2026/3/1", "", "实现流量实时上报、异常告警，覆盖节点与域名维度。"],
  ["监控系统", "数据分析模块", "已完成", "2025/12/18", "", "已完成", "2026/3/4", "", "支持数据统计、趋势分析，为优化决策提供依据。"],
  ["监控系统", "缓存监控模块", "已完成", "2025/12/20", "谢金林", "已完成", "2026/2/28", "谢金林", "实时监控节点缓存状态，预防缓存溢出问题。"],
  ["调度系统", "解析控制模块", "已完成", "2025/12/20", "谢金林", "已完成", "", "谢金林", "实现域名解析调度控制，优化访问路由。"],
  ["安装部署", "设备部署模块", "已完成", "2025/12/20", "", "已完成", "", "", "支持自建节点设备快速部署、配置下发。"],
  ["安装部署", "设备监控报表模块（内存/CPU）", "已完成", "2026/1/20", "", "已完成", "2026/2/20", "", "生成设备运行报表，直观呈现部署节点状态。"],
  ["基础管理系统", "客户管理系统", "已完成", "2025/12/6", "", "已完成", "", "", "支持客户信息管理、权限分配。"],
  ["基础管理系统", "组织架构管理", "已完成", "2025/12/8", "侯文字", "已完成", "", "谢金林", "适配部门组织架构，实现权限分级管控。"],
  ["基础管理系统", "系统管理（基础配置/权限）", "已完成", "2025/12/10", "侯文字", "已完成", "2026/2/28", "", "保障系统稳定运行，支持角色权限灵活配置。"],
  ["配置同步", "节点分组配置自动同步", "已完成", "2025/2/20", "谢金林", "进行中", "2026/4/16", "康云九", "实现节点上线自动同步配置，通过消息订阅方式保障一致性。"],
  ["Cache缓冲", "Cache缓存规则变更", "已完成", "", "谢金林", "进行中", "2026/4/16", "谢金林", "实现管理节点缓存机制，达到资源空间共享与统一规则管理。"],
  ["下一阶段重点任务", "天翼云CDN加速能力测试", "计划中", "待确定", "", "计划中", "待确定", "", "验证加速能力、性能、兼容性，优化接口调用链路。"],
  ["下一阶段重点任务", "网宿CDN加速能力测试与联调", "计划中", "待确定", "", "计划中", "待确定", "", "验证加速能力、性能、兼容性，优化接口调用链路。"],
  ["下一阶段重点任务", "百度云CDN加速能力测试", "进行中", "待确定", "谢金林", "进行中", "待确定", "谢金林", "验证加速能力、性能、兼容性，优化接口调用链路。"],
  ["下一阶段重点任务", "移动CDN对接", "进行中", "待确定", "", "进行中", "待确定", "", "正在对接移动CDN接口。"],
  ["下一阶段重点任务", "自建节点直播加速功能开发", "计划中", "待确定", "", "计划中", "待确定", "", "基于现有节点架构扩展，完成直播流加速能力。"],
];

sheet.getRange(`A4:I${rows.length + 3}`).values = rows;

const endRow = rows.length + 3;
sheet.getRange(`A1:I${endRow}`).format = {
  font: { name: "Microsoft YaHei", size: 10 },
  verticalAlignment: "center",
};
sheet.getRange("A1:I1").format.font = { name: "Microsoft YaHei", size: 16, bold: true, color: "#111827" };
sheet.getRange("A3:I3").format = {
  fill: "#8EA9DB",
  font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};
sheet.getRange(`A4:I${endRow}`).format = {
  wrapText: true,
  verticalAlignment: "center",
};

const borderStyle = { preset: "all", style: "thin", color: "#3F3F46" };
sheet.getRange(`A2:I${endRow}`).format.borders = {
  ...borderStyle,
};

sheet.getRange(`C4:C${endRow}`).format.fill = "#A9D18E";
sheet.getRange(`F4:F${endRow}`).format.fill = "#A9D18E";
sheet.getRange("C27:C31").format.fill = "#DDEBF7";
sheet.getRange("F27:F31").format.fill = "#DDEBF7";

for (const col of ["A", "C", "D", "E", "F", "G", "H"]) {
  sheet.getRange(`${col}4:${col}${endRow}`).format.horizontalAlignment = "center";
}
sheet.getRange(`I4:I${endRow}`).format.horizontalAlignment = "left";

const mergeGroups = [
  [4, 7],
  [8, 10],
  [11, 15],
  [16, 18],
  [19, 19],
  [20, 21],
  [22, 24],
  [25, 25],
  [26, 26],
  [27, 31],
];
for (const [start, stop] of mergeGroups) {
  if (start !== stop) sheet.getRange(`A${start}:A${stop}`).merge();
}

sheet.getRange(`C4:C${endRow}`).dataValidation = {
  rule: { type: "list", values: ["已完成", "进行中", "计划中", "暂停", "待确定"] },
};
sheet.getRange(`F4:F${endRow}`).dataValidation = {
  rule: { type: "list", values: ["已完成", "进行中", "计划中", "暂停", "待确定"] },
};

sheet.getRange(`C4:C${endRow}`).conditionalFormats.add("containsText", {
  text: "进行中",
  format: { fill: "#DDEBF7", font: { color: "#1F4E79" } },
});
sheet.getRange(`F4:F${endRow}`).conditionalFormats.add("containsText", {
  text: "进行中",
  format: { fill: "#DDEBF7", font: { color: "#1F4E79" } },
});
sheet.getRange(`C4:C${endRow}`).conditionalFormats.add("containsText", {
  text: "计划中",
  format: { fill: "#E2F0D9", font: { color: "#1F5E2E" } },
});
sheet.getRange(`F4:F${endRow}`).conditionalFormats.add("containsText", {
  text: "计划中",
  format: { fill: "#E2F0D9", font: { color: "#1F5E2E" } },
});

sheet.getRange("A:A").format.columnWidthPx = 118;
sheet.getRange("B:B").format.columnWidthPx = 210;
sheet.getRange("C:C").format.columnWidthPx = 76;
sheet.getRange("D:D").format.columnWidthPx = 92;
sheet.getRange("E:E").format.columnWidthPx = 76;
sheet.getRange("F:F").format.columnWidthPx = 92;
sheet.getRange("G:G").format.columnWidthPx = 104;
sheet.getRange("H:H").format.columnWidthPx = 76;
sheet.getRange("I:I").format.columnWidthPx = 420;
sheet.getRange("1:1").format.rowHeightPx = 36;
sheet.getRange("2:2").format.rowHeightPx = 24;
sheet.getRange("3:3").format.rowHeightPx = 34;
sheet.getRange(`4:${endRow}`).format.rowHeightPx = 28;

sheet.freezePanes.freezeRows(3);

const templateRowsStart = endRow + 2;
sheet.getRange(`A${templateRowsStart}:I${templateRowsStart}`).merge();
sheet.getRange(`A${templateRowsStart}:I${templateRowsStart}`).values = [["空白填写区（可复制上方行样式继续新增）"]];
sheet.getRange(`A${templateRowsStart}:I${templateRowsStart}`).format = {
  fill: "#F3F4F6",
  font: { bold: true, color: "#374151" },
};

const blankStart = templateRowsStart + 1;
const blankEnd = blankStart + 9;
sheet.getRange(`A${blankStart}:I${blankEnd}`).values = Array.from({ length: 10 }, () => Array(9).fill(""));
sheet.getRange(`A${blankStart}:I${blankEnd}`).format = {
  wrapText: true,
  verticalAlignment: "center",
};
sheet.getRange(`A${blankStart}:I${blankEnd}`).format.borders = {
  ...borderStyle,
};
sheet.getRange(`C${blankStart}:C${blankEnd}`).format.fill = "#E2F0D9";
sheet.getRange(`F${blankStart}:F${blankEnd}`).format.fill = "#E2F0D9";
sheet.getRange(`C${blankStart}:C${blankEnd}`).dataValidation = {
  rule: { type: "list", values: ["已完成", "进行中", "计划中", "暂停", "待确定"] },
};
sheet.getRange(`F${blankStart}:F${blankEnd}`).dataValidation = {
  rule: { type: "list", values: ["已完成", "进行中", "计划中", "暂停", "待确定"] },
};

const info = await workbook.inspect({
  kind: "table",
  range: "2026年3月CDN!A1:I12",
  include: "values,formulas",
  tableMaxRows: 12,
  tableMaxCols: 9,
});
console.log(info.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

const preview = await workbook.render({
  sheetName: "2026年3月CDN",
  range: "A1:I42",
  scale: 1,
  format: "png",
});
await fs.writeFile(path.join(outDir, "研发月度进度表模板预览.png"), new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(path.join(outDir, "研发月度进度表模板.xlsx"));
console.log(path.join(outDir, "研发月度进度表模板.xlsx"));
