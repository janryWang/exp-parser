[![npm version](https://badge.fury.io/js/exp-parser.svg)](https://badge.fury.io/js/exp-parser)
[![Build Status](https://travis-ci.org/janryWang/exp-parser.svg)](https://travis-ci.org/janryWang/exp-parser)
[![Coverage Status](https://coveralls.io/repos/janryWang/exp-parser/badge.svg?branch=master&service=github)](https://coveralls.io/github/janryWang/exp-parser?branch=master)

Expression Parser(exp-parser)
===

##安装

```
npm install --save exp-parser
```

##问题

1. 为啥要山寨一个表达式解析器？
2. 表达式解析器能做神马事情？
3. 怎么自制表达式解析器？



##回答

1. 因为好玩，因为市面上好像还没有一款独立的表达式解析器，如果有的话，体积估计也不小，我打算做一个较为轻量级，同时扩展性较强的表达式解析器，功能与angular1.x的指令表达式解析器一致，最重要是的可扩展，提供内核级别的扩展性
2. 类似于angular的指令表达式，你可以集成在模板引擎中，主要用于解析组件的属性，组件于组件间传值计算，过滤，话说。。。。这其实就是将视图逻辑从后端中释放出来。
3. 本人其实就是个初学者，原来一直想搞个表达式解析器，苦于无从下手，后来找到了[jsep](http://jsep.from.so/)这个表达式AST生成器，它能自动解析表达式，生成一个json结构的抽象语法树，所以，后面我仅仅只需要深度遍历这棵树就行了，然后边遍历边计算，注意是后序遍历，就这样一层一层的剥开计算结果的心。其实真心没啥技术含量，我做这个仅仅只是为了好玩，又或者说后面自己需要的时候也不需要各种找东西，麻烦。。。。


##API文档

###解析

```
import ExpressionParser form 'expression-parser'

let parser = new ExpressionParser({//注入一个全局上下文，比如将window注入进去，不过不建议这样做，如果方法被拦截，可能会发生危险，尽量是将闭包内受保护的对象注入其中
	
})

parser.parse('2 * 2') // 4

parser.parse('a * b',{ //变量求值
	a:4,
	b:5
}) // 20

parser.parse('fuck(a,b)',{//函数求值
	fuck(x,y){
		return x * y;
	},
	a:5,
	b:6
}) // 30

parser.parse('a * b|fuck:34:cc',{//作用域注入
	a:5,
	b:6,
	cc:7
},{//过滤器注入
	fuck(x,y){
		return (input)=>{
			return (input - x) / y;
		}
	}
})

```

###扩展

```

const {BINARY_EXP} = ExpressionParser.expressionTypes;


ExpressionParser.injectExpHandler(BINARY_EXP,(tree)=>{

})

//添加一个优先级为10的二进制操作符^
ExpressionParser.addBinaryOp("^", 10);

//添加一个一元操作符@
ExpressionParser.addUnaryOp('@');

//移除一个二进制操作符
ExpressionParser.removeBinaryOp(">>>");

//移除一个一元操作符
ExpressionParser.removeUnaryOp("~");


```
