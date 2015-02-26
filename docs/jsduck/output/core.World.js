Ext.data.JsonP.core_World({"tagname":"class","name":"core.World","autodetected":{},"files":[{"filename":"World.js","href":"World.html#core-World"}],"members":[{"name":"__context","tagname":"property","owner":"core.World","id":"property-__context","meta":{"private":true}},{"name":"","tagname":"property","owner":"core.World","id":"static-property-","meta":{"static":true}},{"name":"addUserData","tagname":"method","owner":"core.World","id":"method-addUserData","meta":{}},{"name":"setCurrentUserName","tagname":"method","owner":"core.World","id":"method-setCurrentUserName","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-core.World","short_doc":"To make internal callable steps:\n\n\nAdd a hook. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/World.html#core-World' target='_blank'>World.js</a></div></pre><div class='doc-contents'><p>To make internal callable steps:</p>\n\n<ol>\n<li><p>Add a hook.\nThis will make the world instance to know about the test context.</p>\n\n<p>  var hooks = function(){\n      var testContext = this;\n      this.Before(function(cb){\n          this.setTestContext(testContext);\n          cb();\n      });\n  };</p></li>\n<li><p>Patch the test context.\nMake automatically to parse correct values. For example an <code>1.1</code> argument will be\nautomatically converted into a decimal number, but <code>\"1.1\"</code> will be a string.</p>\n\n<p>  this.World.testUtils.useEJSONArguments(this);</p></li>\n</ol>\n\n\n<p>Make all the <code>Given</code> methods sync with fibers. After you do this the steps will\nrun sync and no need to call the <code>callback</code> function when the step ends.</p>\n\n<pre><code>this.World.testUtils.makeFiber(this);\n</code></pre>\n\n<p>In order to have the new <code>addStep</code> method in the text context you need\nto do this. This is required to call the step from another step.</p>\n\n<pre><code>this.World.testUtils.addStepMethod(this);\n</code></pre>\n\n<p>Should be in this order so the saved step is already using fiber.</p>\n\n<ol>\n<li><p>Inherit your world from our world.\nThis will add a method to your world instance named <code>callStep</code> which enables you\nto call a step.</p></li>\n<li><p>Define a step.\nYour step definition should look like this:</p>\n\n<p>  this.addStep('a', /^a$/, function(){\n      console.log('a')\n  })</p></li>\n</ol>\n\n\n<p>The API is like this:</p>\n\n<pre><code>this.addStep(uniqueStepName, regexMatch, function);\n</code></pre>\n\n<p>Notice that the function will not get any <code>callback</code> argument at the end as\nwith async tests.</p>\n\n<p>Let's add another step</p>\n\n<pre><code>this.addStep('b', /^b (\\d+)$/, function(n){\n    console.log('b', n)\n})\n</code></pre>\n\n<ol>\n<li><p>Run it.\nAdd the feature <code>Given a</code>.\nCall another step:</p>\n\n<p>  this.addStep('a', /^a$/, function(){\n      console.log('a')\n      this.callStep('b', 1);\n  })</p></li>\n</ol>\n\n\n<p>The <code>callStep</code> API looks like this:</p>\n\n<pre><code>this.callStep(uniqueStepName, arguments)\n</code></pre>\n\n<p>Now the output will be:</p>\n\n<pre><code>a\nb 1\n</code></pre>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Instance properties</h3><div id='property-__context' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='core.World'>core.World</span><br/><a href='source/World.html#core-World-property-__context' target='_blank' class='view-source'>view source</a></div><a href='#!/api/core.World-property-__context' class='name expandable'>__context</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Context is useful if you need to keep track of stuff. ...</div><div class='long'><p>Context is useful if you need to keep track of stuff. For example\nyou have the default user to open a new browser. Now every action\nyou do, you don't want to specify on which browser to take action\nbecause is automatically detected by the __context variables.\nNow if you want another browser you just add it and name it browser\n\"crazy\". Then switch the context and set the current browser to \"crazy\".\nNow every future action will be called on the \"crazy\" browser.\nThen go back and set the current browser to \"default\" to go to the first\nbrowser and run actions against it.</p>\n<p>Defaults to: <code>{currentBrowser: 'default', currentUser: 'default'}</code></p></div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static properties</h3><div id='static-property-' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='core.World'>core.World</span><br/><a href='source/World.html#core-World-static-property-' target='_blank' class='view-source'>view source</a></div><a href='#!/api/core.World-static-property-' class='name expandable'></a> : <a href=\"#!/api/utils\" rel=\"utils\" class=\"docClass\">utils</a><span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-addUserData' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='core.World'>core.World</span><br/><a href='source/World.html#core-World-method-addUserData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/core.World-method-addUserData' class='name expandable'>addUserData</a>( <span class='pre'>userData</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Adds a new user. ...</div><div class='long'><p>Adds a new user. A user has a name and email by default.\nMore can be added as you want.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>userData</span> : Object<div class='sub-desc'>\n<ul><li><span class='pre'>name</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>email</span> : String<div class='sub-desc'>\n</div></li></ul></div></li></ul></div></div></div><div id='method-setCurrentUserName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='core.World'>core.World</span><br/><a href='source/World.html#core-World-method-setCurrentUserName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/core.World-method-setCurrentUserName' class='name expandable'>setCurrentUserName</a>( <span class='pre'>name</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This will shift the context of the actions to this user. ...</div><div class='long'><p>This will shift the context of the actions to this user.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});