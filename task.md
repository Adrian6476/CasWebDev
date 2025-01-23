### 通用产品门户模板

我们需要为企业内部各种团队和事业群开发出一个通用的门户页面，以供其它团队快速开发和启用项目，统一维护，优化开发效率。

门户页面类似于博客，用于介绍公司业务内容、展示公司消息和动态，该统一模板应具备以下特点：

- 使用Vue作为核心开发，使用Vuetify作为底层的UI组件
- 主题可配置
- 数据格式规范化
- 可切换语言
- 代码低冗余，高度组件化

我们将会给出门户框架的参考图，以及给出需要开发的组件列表和说明，最后需要交付一套脚手架，仅需配置主题色和数据库即可直接启动项目。

#### 原型参考

![](https://geelao-oss.oss-cn-hangzhou.aliyuncs.com/db/202208040059084.png)

该图描述了Top Bar和首页大图+Title+Slogan+Button Link的布局，以及一个自定义颜色的Alert。

![](https://geelao-oss.oss-cn-hangzhou.aliyuncs.com/db/202208040101443.png)

![](https://geelao-oss.oss-cn-hangzhou.aliyuncs.com/db/202208040104779.png)

该图描述了首页中Brief Introduction的标题、简介、Text Button Link和配图的布局，并且允许自定义图像左右位置

![](https://geelao-oss.oss-cn-hangzhou.aliyuncs.com/db/202208040104538.png)

该图描述了首页的卡片罗列以及title组件布局

![](https://geelao-oss.oss-cn-hangzhou.aliyuncs.com/db/202208040106110.png)

该图描述了“联系我们”页面的带背景图banner，包含标题、正文和按钮

![](https://geelao-oss.oss-cn-hangzhou.aliyuncs.com/db/202208040107179.png)

该图描述了博客文章的展示卡片以及“加载更多”按钮

![](https://geelao-oss.oss-cn-hangzhou.aliyuncs.com/db/202208040105492.png)

该图描述了页脚的布局，包含社交媒体链接、完整的网站地图、企业基本声明、语言切换选择框



![](https://geelao-oss.oss-cn-hangzhou.aliyuncs.com/db/202208040109864.png)

该图描述了博客文章浏览页中的页头，包含部门、标题、时间、作者和分享按钮

![](https://geelao-oss.oss-cn-hangzhou.aliyuncs.com/db/202208040110239.png)

该图描述了博客文章浏览页中的正文排版样式

![](https://geelao-oss.oss-cn-hangzhou.aliyuncs.com/db/202208040111536.png)

该图描述了博客文章浏览页最后的相关推荐模块，包含一个分割线、标题、卡片走马灯组件。

更多样式你能够参考https://marketingplatform.google.com/about/，该页面具备响应式能力，为手机端做了优化，实习生可以看自己的完成情况决定是否写相关布局。

#### 开发流程

推荐学员先进行纯界面组件的开发，其次进行综合布局，最后进行数据绑定。

数据绑定选用axios，接口遵循REST规范。

数据绑定阶段我们使用https://jsonplaceholder.typicode.com/进行模拟测试。

#### Axios相关

当今的Javascript网络开发社群中，无论是前端还是后端，发送HTTP请求绝大多数都不会直接使用HTTP库，而是采用开源的Axios库，它提供一个更加安全且快捷的HTTP请求体验。

http://nodejs.cn/learn/make-an-http-post-request-using-nodejs

REST全称是Representational State Transfer，中文意思是表述（编者注：通常译为表征）性状态转移。 它首次出现在2000年Roy Fielding的博士论文中，Roy Fielding是HTTP规范的主要编写者之一。 他在论文中提到："我这篇文章的写作目的，就是想在符合架构原理的前提下，理解和评估以网络为基础的应用软件的架构设计，得到一个功能强、性能好、适宜通信的架构。REST指的是一组架构约束条件和原则。" 如果一个架构符合REST的约束条件和原则，我们就称它为RESTful架构。

REST本身并没有创造新的技术、组件或服务，而隐藏在RESTful背后的理念就是使用Web的现有特征和能力， 更好地使用现有Web标准中的一些准则和约束。虽然REST本身受Web技术的影响很深， 但是理论上REST架构风格并不是绑定在HTTP上，只不过目前HTTP是唯一与REST相关的实例。 所以我们这里描述的REST也是通过HTTP实现的REST。

https://www.runoob.com/w3cnote/restful-architecture.html

我们在前端开发没有接触到实际业务数据之前，一般都需要上级或是对接的后端给出数据格式规范做一套假数据以供自己测试。

在这里我们介绍一个伪数据提供网站JSONPlaceHolder：

https://jsonplaceholder.typicode.com/

你也可以fork他们的GitHub项目并且自行更改所需的数据：

我们需要模拟4个接口即可完成整个网站的数据需求：

/news，获取用于渲染卡片的新闻内容

```json
{
    "id": "",
    "title": "",
    "abstract": "",
    "cover": "",
    "date": "",
    "category": ""
}
```



/about，“关于我们”模块所使用的内容

```json
{
	"id": "",
    "category": "",
    "data": {
        ...
    }
}
```

关于模块存储一些非规范化条目的内容，比如说公司介绍、主营业务、产品等，因此其数据格式是自由的，在使用上仅约束一个data键值，内部数据前端自行编写逻辑渲染。



/press，新闻正文所使用的内容

```json
{
    "id": "",
    "title": "",
    "cover": "",
    "date": "",
    "category": "",
    "contentMD": ""
}
```



/staff，渲染团队成员列表所使用的内容

```json
{
    "name": "",
    "avatar": "",
    "pos": ""
}
```

#### 组件

门户网站的布局较为简单，也是可以通过手写flexbox完成的，但我们建议遵从angular-material的grid系统。

以下是部分可能需要用到的组件：

| 组件名           | 组件说明                                     |
| ------------- | ---------------------------------------- |
| brand-icon    | 附带src参数，展示品牌图标，高度128px，宽度自动              |
| header        | 网页头部分，包含自适应缩放的背景图，brand-icon和nav-bar都包在header中 |
| slogan        | 在header中间的品牌标语                           |
| about-us      | 关于我们模块，附带src指定该模块的图片，同时在该component中直接键入文本，渲染到组件正文中 |
| paragraph     | 图文文章段落，用class：left right指定图片的位置是居左还是居右   |
| carousel      | 走马灯式展示组件，内部布局推荐参考：https://next.vuetifyjs.com/en/components/carousels/、https://omi.cdn-go.cn/admin/latest/index.html#/card-component |
| carousel-item | 走马灯中的单个项目，推荐内嵌card相关组件进行服用               |
| staff         | 职员组件                                     |
| staff-avatar  | 职员头像                                     |
| staff-name    | 职员姓名                                     |
| staff-pos     | 职员岗位                                     |
| footer        | 页脚部分                                     |
| f-title       | 页脚部分的栏目标题                                |
| f-link        | 页脚的链接按钮，携带a参数用于跳转                        |
| f-cop         | 页脚的版权声明                                  |