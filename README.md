`compo` Demo
============

This is a demo project for `compo`. It is a Cut Out And Keep Play Along At Home demo.

Most of the demo will be done via the command line.

Start by cloning this repo, and installing the dependencies.

`compo` was written with node 4.0, so you'll probably want to get that running. Hint: `nvm use 4.0`

```
% git clone https://github.com/jhugman/compo-contrib-demo.git
% cd compo-contrib-demo
% npm install
```

Step 0
------

You can start the compo with the command:
```
% npm start
```

Compo is a plugin manager. Without plugins, it does nothing.

```
% npm start
> node --use-strict node_modules/compo/bin/cli.js

% 
```

Step 1
------

So start it with a plugin.

```
% npm start compo-contrib-console
```

This time, something more should've happened:

```
% npm start compo-contrib-console
> node --use-strict node_modules/compo/bin/cli.js "compo-contrib-console"

... Type ? for a list of commands
 >> ?
...   ?   Prints this message
 >> ^C
... Goodbye
% 
```

The `compo-contrib-console` is a plugin that you installed during `npm install`. It is responsible for setting up an interactive prompt and a tiny bit about parsing the strings that the user types.

It only knows about one command, `?` which isn't very useful right now.

`^C` quits the app, so let's do that.

Step 2
------
We could add more commands by loading more plugins:
```
% npm start compo-contrib-console ./examples/console-demo-plugin
```

This is my console session:
```
... Type ? for a list of commands
 >> ?
...   ?   Prints this message
...   hello   A command to greet the computer
...   i am  A command to tell the computer your name
 >> hello computer
... hello new friend
 >> i am james
... hello james… i am computer
 >> ^C
 %
```

The plugin `./examples/console-demo-plugin` is a demo plugin distributed with the console. It adds a one word command `hello` and a two word one `i am` to the console.

Step 3
------
Let's try something adding some more interesting plugins:
```
% npm start compo-contrib-console compo-contrib-server ./examples/server-demo-plugin

```

The becoming familiar console prompt starts again, but let's explore the commands.

```
... Type ? for a list of commands
 >> Compo server app listening at http://localhost:8080

 >> ?
...   ?   Prints this message
...   list  routes  List the routes that the server is serving
 >> list routes
... Available end points
...   all /r/*  Resource default directory - examples/server-demo-plugin/resources
...   get /u/:user  User profile page
 >> 

```

What's happening here:
 * `compo-contrib-server` has started an http server, listening on port 8080.
 * `compo-contrib-server` has added a `list routes` command to the console.
 * `server-demo-plugin` has extended the server with two endpoints: one serving a user profile page, the other a static directory.

You can prove that the server is running either by running `curl` in another terminal. Let us `GET` user the fake profile page for user `nora`.

```
$ curl localhost:8080/u/nora
<h1>Hello nora</h1><img src="/r/it-worked.gif">
```

or by hitting [the page itself][/nora].

[/nora]: http://localhost:8080/u/nora

Step 4
------
So we have a server app with a console; the bit that's app specific just know how to register endpoints and commands with the relevant subsystems. Let's kick it into high gear.

```
% npm start compo-contrib-console compo-contrib-server ./examples/server-demo-plugin compo-contrib-mgmt ./examples/user-admin-plugin
```

Now our app is composed of five plugins, which we have chosen at runtime. Some of those plugins accept extensions, and some of those plugins provide extensions.

```
... Type ? for a list of commands
 >> Compo server app listening at http://localhost:8080

 >> ?
...   ?   Prints this message
...   list  ep          List the extension points available to extend
...   list  plugins    List the plugins that are currently loaded
...   list  routes     List the routes that the server is serving
...   list  singletons  List the singletons that are currently available
...   list  users      A list of the users in the userController
...   load  plugin      Load a new plugin
...   restart plugin   Unload then load an installed plugin
...   unload  plugin    Unload an installed plugin
 ```
 That's a few more commands!
 
 The `compo-contrib-mgmt` provides us with console commands to inspect and manage plugins.
 
 ```
 >> list plugins
... Plugins currently loaded in compo
...   compo-contrib-console node_modules/compo-contrib-console  A console plugin for compo apps
...   compo-contrib-server   node_modules/compo-contrib-server   A plugin providing a base for `compo` servers.
...   server-demo-plugin     examples/server-demo-plugin         A server plugin that adds two endpoints. See list routes on the console.
...   compo-contrib-mgmt     node_modules/compo-contrib-mgmt     A console plugin for managing plugins.
...   user-admin-plugin     examples/user-admin-plugin         A server plugin that adds two endpoints. See list routes on the console.
 >> 
 ```
 
Plugins can extend other plugins by contributing 'extensions'. Extensions are collected in named 'extension points'. That sounds way too abstract so let's see what we've got:
```
 >> list ep
... Extension points accepting extensions
...   console.command (9) A command beginning with one or two words.
...   http.endpoint (3) Add an end point to either a function, or a directory
 >> 
```
Ok, so this app (of 5 plugins) has 9 console commands and 3 http endpoints.

Plugins can contribute singleton objects that other plugins can use. 
```
>> list singletons
... Singletons currently available
...   pluginManager     The plugin manager running this show. You probably don't want this.
...   extensionRegistry The extension registry gluing everything together. You probably don't want this.
...   repl               An object to interact with the console from other plugins.
...   userController     A fake user controller.
>> 
```
Here we see the `userController` exposed for any plugin to use. 

None of the app needs to know where on disk it is, or passing it around your data-structures: all code accesses the same instance in the same convenient way.

The implementation of `userController`, whether it is a real controller or a dummy one used to test another plugin – is irrelevant, because the `userController` is provided by another plugin, and those plugins are chosen at runtime.

We can see the `list users` using it. 
```
>> list users
... All users:
...   None.
```
Step 5
------
The user controller is fake so didn't persist anything between restarts. So let's go back to click on the [server's /u/:user endpoint][/nora] again. That was the user profile page on our `localhost` server for `nora`.

The [/u/:user request handler](https://github.com/jhugman/compo-contrib-demo/blob/master/examples/server-demo-plugin/lib/endpoints.js) adds to the `userController`.

[/users]: http://localhost:8080/users

If you're playing along at home, you can go to the [`/users` page on your server][/users] and see that `nora` has just hit the profile page, so must be logged in, or something else app specific.

----

# All users

* nora

----

You could also see this same information on the console:
```
 >> list users
... All users:
...   nora
 >> 
```

The implementations of [the `/users` endpoint][endpoints.js] and [the `list users` console command][console.js] access the `userController` in the same way.

 [endpoints.js]: https://github.com/jhugman/compo-contrib-demo/blob/master/examples/user-admin-plugin/lib/endpoints.js
 [console.js]: https://github.com/jhugman/compo-contrib-demo/blob/master/examples/user-admin-plugin/lib/console.js

The only other file in the plugin is what ties it into the rest of the app. That is the `compo` manifest file.

Here is the [manifest for `user-admin-plugin`](https://github.com/jhugman/compo-contrib-demo/blob/master/examples/user-admin-plugin/compo.json) is small enough to reproduce here:

```
{
  "manifest_version": "1.0",
  "extensions": [
    {
      "epID": "http.endpoint",
      "path": "/users",
      "method": "get",
      "function": "./lib/endpoints!getUsers",
      "description": "A fake user admin page."
    },
    {
      "epID": "console.command",
      "firstWord": "list",
      "secondWord": "users",
      "function": "./lib/console!getUsers",
      "description": "A list of the users in the userController"
    }
  ],

  "permissions": [
    "userController"
  ]
}
```

One of `compo`'s explicit design goals is to make code more auditable, either by human reviewers or tooling.

Here we see that this plugin contributes an [`http.endpoint`][endpoints.js] and [`console.command`][console.js]. It asks for permission to use the `userController`, but it knows not where it comes from.

Thus we can infer that this plugin is two different user interfaces onto the same `userController`.

It is of no concern to this plugin how the console or server or `userController` is implemented; the heavy lifting of the setting up and configuring, is done else where and simply handed to the plugin.

Step 6
------
Now we tire of the `user-admin-plugin`. Let us be rid of it.

```
 >> unload plugin user-admin-plugin
 >> list routes
... Available end points
...   all /r/*      A statically served directory - examples/server-demo-plugin/resources
...   get /u/:user  A fake user profile page.
 >>
 >>
 >> ?
...   ?   Prints this message
...   list  ep  List the extension points available to extend
...   list  plugins List the plugins that are currently loaded
...   list  routes  List the routes that the server is serving
...   list  singletons  List the singletons that are currently available
...   load  plugin  Load a new plugin
...   restart plugin  Unload then load an installed plugin
...   unload  plugin  Unload an installed plugin
```
We see that there is no longer a route for `/users`, and we don't have a `list users` command available on the console. 

But if we hit the [/users][/users] page we still get something back. 

Step 7
------
I happen to know that there is no easy way to persuade `express` to unregister a handler, so I know that the endpoint can't be removed from the server. There's also an issue with things need to be configured in order.

But we can work round that. By restarting the server plugin. :)

```
 >> restart plugin compo-contrib-server
Server says goodbye
... Unloaded compo-contrib-server from node_modules/compo-contrib-server
... Loaded compo-contrib-server
 >> Compo server app listening at http://localhost:8080
 >> 
```

If we hit the [/users][/users] page again, we should now see that it is 404ing. We can now see that the `user-admin-plugin` is finally gone. 

The other pages still work: here's [Clegg's user page][/cleg].

[/cleg]: http://localhost:8080/u/clegg

But we can restart the bit of the app that listens for HTTP traffic on port 8080. On restart it is configured with the endpoints it should have.

Step 8
------
Further more, no state has been lost, because the plugin that declared `userController` (`./examples/server-demo-plugin`) has not been unloaded, it is still available, and…

Oh, we can't tell if it's lost state, because the tools for inspecting the `Users` 'table' are in the `user-admin-plugin`. 

We'll have to load that again:

```
 >> load plugin ./examples/user-admin-plugin
... Loaded user-admin-plugin
 >> list users
... All users:
...   nora
...   clegg
 >> 
```

Not only have we kept state, but the same `userController` stayed active throughout, collecting `clegg`'s visit too.

Exercises
---------
Look at how console command extensions are consumed in [the Repl class][console-plugin.js].

Look at how an instance of how the Repl class is exposed in the [console plugin's manifest][console-plugin.json].

 [console-plugin.js]: [https://github.com/jhugman/compo-contrib-console/blob/master/lib/repl.js]
 [console-plugin.json]: [https://github.com/jhugman/compo-contrib-console/blob/master/compo.json]

Now look at the way of adding (and perhaps removing) extensions from an already existing data-structure. In this case, adding endpoints to an `express` server.

 [server-plugin.js]: [https://github.com/jhugman/compo-contrib-server/blob/master/index.js#L48]

Add another console command or endpoint to one of the example plugins.

Wrap up
=======
This demo should give you almost all of the mental model of what `compo` does.

It should've given you the idea of how `compo` facilitates modularization of a monolithic app, aids communication between teams and lowers the bar on writing re-usable code. At the same time, because there are so few moving parts, and focus on wiring, it should also come with the minimum of any magic.
