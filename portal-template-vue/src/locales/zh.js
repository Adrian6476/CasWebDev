export default {
  nav: {
    home: '首页',
    products: '产品',
    news: '新闻',
    contact: '联系我们'
  },
  home: {
    hero: {
      title: '产品名称',
      slogan: '产品口号展示位置',
      getStarted: '立即开始'
    },
    about: {
      title: '关于我们',
      description: '这里是公司简介。简要介绍贵公司的组织结构和使命。',
      productTitle: '关于我们的产品',
      productSubtitle: '了解我们的独特之处',
      learnMore: '了解更多'
    },
    features: {
      title: '产品特点',
      subtitle: '我们的优势所在',
      items: {
        fast: {
          title: '快速高效',
          description: '我们的解决方案提供闪电般的性能和高效的资源利用。'
        },
        secure: {
          title: '安全可靠',
          description: '以安全为核心设计，保护您的数据是我们的首要任务。'
        },
        responsive: {
          title: '响应式设计',
          description: '在所有设备和屏幕尺寸上无缝运行。'
        }
      }
    },
    team: {
      title: '我们的团队',
      subtitle: '遇见我们成功背后的团队'
    }
  },
  news: {
    title: '最新动态',
    subtitle: '了解我们的最新消息',
    readMore: '阅读更多',
    relatedArticles: '相关文章',
    loadMore: '加载更多',
    search: '搜索文章',
    categories: {
      all: '全部',
      product: '产品',
      company: '公司',
      technology: '技术'
    }
  },
  contact: {
    title: '联系我们',
    subtitle: '期待您的留言',
    form: {
      title: '发送消息',
      getInTouch: '联系我们',
      name: '姓名',
      email: '邮箱',
      message: '留言',
      send: '发送消息',
      nameRequired: '请输入姓名',
      nameLength: '姓名至少需要2个字符',
      emailRequired: '请输入邮箱',
      emailValid: '请输入有效的邮箱地址',
      messageRequired: '请输入留言内容',
      messageLength: '留言内容至少需要10个字符',
      success: '消息发送成功！',
      error: '发送失败，请稍后重试。'
    },
    info: {
      title: '联系方式',
      address: '地址',
      phone: '电话',
      email: '邮箱'
    },
    social: {
      title: '关注我们'
    }
  },
  footer: {
    aboutUs: '关于我们',
    quickLinks: '快速链接',
    contactUs: '联系我们',
    copyright: '© {year} 公司名称版权所有'
  },
  common: {
    save: '保存',
    close: '关闭'
  },
  auth: {
    login: '登录',
    register: '注册',
    profile: '个人资料',
    settings: '设置',
    logout: '退出登录',
    welcome: '欢迎回来，{name}',
    createAccount: '创建账户',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    rememberMe: '记住我',
    forgotPassword: '忘记密码？',
    noAccount: '没有账户？',
    haveAccount: '已有账户？',
    signIn: '登录',
    signUp: '注册',
    passwordRequirements: '密码至少需要8个字符',
    passwordMatch: '密码必须匹配',
    username: '用户名',
    usernameRequired: '请输入用户名',
    emailRequired: '请输入邮箱',
    passwordRequired: '请输入密码',
    invalidCredentials: '邮箱或密码错误',
    accountCreated: '账户创建成功！',
    logoutSuccess: '您已成功退出登录',
    emailInUse: '该邮箱已被注册',
    loginSuccess: '登录成功！',
    registrationError: '注册失败，请稍后重试',
    profileCreationError: '创建用户资料失败',
    timeout: '请求超时，请检查网络连接后重试'
  },
  settings: {
    title: '设置',
    appearance: '外观',
    darkMode: '深色模式',
    followSystemTheme: '跟随系统主题',
    primaryColor: '主要颜色',
    secondaryColor: '次要颜色',
    accentColor: '强调颜色',
    language: '语言',
    selectLanguage: '选择语言',
    saved: '设置保存成功',
    error: '设置保存失败',
    updated: '设置已更新'
  },
  profile: {
    title: '个人资料',
    changeAvatar: '更换头像',
    displayName: '显示名称',
    displayNameRequired: '请输入显示名称',
    phone: '手机号码',
    bio: '个人简介',
    avatarUpdated: '头像更新成功',
    avatarError: '头像更新失败',
    displayNameUpdateWarning: '资料保存成功，但显示名称更新失败（需重新登录生效）',
    saved: '资料保存成功',
    saveFailed: '资料保存失败，请重试',
    phoneRequired: '请输入手机号码',
    phoneValid: '请输入有效的手机号码',
    bioLength: '个人简介不能超过500字'
  }
}
