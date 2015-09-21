This is a demo project for `compo`.

Most of the demo will be done via the command line.

Start by cloning this repo, and installing the dependencies.

```
% git clone https://github.com/jhugman/compo-contrib-demo.git
% cd compo-contrib-demo
% npm install
```

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

We could add more commands by loading more plugins:
```
% npm start compo-contrib-console compo-contrib-console/examples/console-demo-plugin
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

The plugin `compo-contrib-console/examples/console-demo-plugin` is a demo plugin distributed with the console. It adds a one word command `hello` and a two word one `i am` to the console.

Let's try something adding some more interesting plugins:
```
% npm start compo-contrib-console compo-contrib-server compo-contrib-server/examples/server-demo-plugin

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
...   all /r/*  Resource default directory - ./node_modules/compo-contrib-server/examples/server-demo-plugin/resources
...   get /u/:user  User profile page
 >> 

```

What's happening here:
 * `compo-contrib-server` has started an http server, listening on port 8080.
 * `compo-contrib-server` has added a `list routes` command to the console.
 * `server-demo-plugin` has extended the server with two endpoints: one serving a user profile page, the other a static directory.

You can prove that the server is running either by running `curl` in another terminal

```
$ curl localhost:8080/u/you
<h1>Hello you</h1><img src="/r/it-worked.gif">
```

or by hitting [the page itself](http://localhost:8080/u/you).
