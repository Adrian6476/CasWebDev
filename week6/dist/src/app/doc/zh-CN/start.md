# Markdown 测试文件

该文件用于测试 `md-content` 组件中各种 Markdown 功能的渲染。

## 文本样式

- **加粗文本**：这是一个 **加粗** 文本示例。
- *斜体文本*：这是一个 *斜体* 文本示例。
- _下划线文本_：这是一个 _下划线_ 文本示例。
- ~~删除线文本~~：这是一个 ~~删除线~~ 文本示例。

## 列表

### 无序列表

- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
- 项目 3

### 有序列表

1. 第一个项目
2. 第二个项目
   1. 子项目 2.1
   2. 子项目 2.2
3. 第三个项目

## 任务列表

- [ ] 任务 1
- [x] 任务 2（已完成）
- [ ] 任务 3

## 引用块

> 这是一个引用块。引用块对于引用文本很有用。

## 代码块

这是一个简单的代码块：

```python
def hello_world():
    print("Hello, world!")
```

## 数学公式

行内公式示例：$a^2 + b^2 = c^2$。

这是一个块公式：

$$
E = mc^2
$$

这应该使用您集成的库以 SVG 格式渲染数学公式。