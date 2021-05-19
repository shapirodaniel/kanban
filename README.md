# Boilermaker

_Good things come in pairs_

Looking to mix up a backend with `express`/`sequelize` and a frontend with
`react`/`redux`? That's `boilermaker`!

Follow along with the boilerplate workshop to make your own! This canonical
version can serve as a reference, or a starting point. For an in depth
discussion into the code that makes up this repository, see the
[Boilermaker Guided Tour][boilermaker-yt]

[boilermaker-yt]: https://www.youtube.com/playlist?list=PLx0iOsdUOUmn7D5XL4mRUftn8hvAJGs8H

## Setup

To use this as boilerplate, you'll need to take the following steps:

- Don't fork or clone this repo! Instead, create a new, empty
  directory on your machine and `git init` (or create an empty repo on
  Github and clone it to your local machine)
- Run the following commands:

```
git remote add boilermaker https://github.com/FullstackAcademy/boilermaker.git
git fetch boilermaker
git merge boilermaker/master
```

Why did we do that? Because every once in a while, `boilermaker` may
be updated with additional features or bug fixes, and you can easily
get those changes from now on by entering:

```
git fetch boilermaker
git merge boilermaker/master
```

## Customize

Now that you've got the code, follow these steps to get acclimated:

- Update project name and description in `package.json` and
  `.travis.yml` files
- `npm install`
- Create two postgres databases (`MY_APP_NAME` should match the `name`
  parameter in `package.json`):

```
export MY_APP_NAME=boilermaker
createdb $MY_APP_NAME
createdb $MY_APP_NAME-test
```

- By default, running `npm test` will use `boilermaker-test`, while
  regular development uses `boilermaker`
- Create a file called `secrets.js` in the project root
  - This file is listed in `.gitignore`, and will _only_ be required
    in your _development_ environment
  - Its purpose is to attach the secret environment variables that you
    will use while developing
  - However, it's **very** important that you **not** push it to
    Github! Otherwise, _prying eyes_ will find your secret API keys!
  - It might look like this:

```
process.env.GOOGLE_CLIENT_ID = 'hush hush'
process.env.GOOGLE_CLIENT_SECRET = 'pretty secret'
process.env.GOOGLE_CALLBACK = '/auth/google/callback'
```

### OAuth

- To use OAuth with Google, complete the steps above with a real client
  ID and client secret supplied from Google
  - You can get them from the [Google APIs dashboard][google-apis].

[google-apis]: https://console.developers.google.com/apis/credentials

## Linting

Linters are fundamental to any project. They ensure that your code
has a consistent style, which is critical to writing readable code.

Boilermaker comes with a working linter (ESLint, with
`eslint-config-fullstack`) "out of the box." However, everyone has
their own style, so we recommend that you and your team work out yours
and stick to it. Any linter rule that you object to can be "turned
off" in `.eslintrc.json`. You may also choose an entirely different
config if you don't like ours:

- [Standard style guide](https://standardjs.com/)
- [Airbnb style guide](https://github.com/airbnb/javascript)
- [Google style guide](https://google.github.io/styleguide/jsguide.html)

## Start

Running `npm run start-dev` will make great things happen!

If you want to run the server and/or `webpack` separately, you can also
`npm run start-server` and `npm run build-client`.

From there, just follow your bliss.

## Deployment

Ready to go world wide? Here's a guide to deployment! There are two
supported ways to deploy in Boilermaker:

- automatically, via continuous deployment with Travis.
- "manually", from your local machine via the `deploy` script.

Either way, you'll need to set up your deployment server to start.
The steps below are also covered in the CI/CD workshop.

### Heroku

1.  Set up the [Heroku command line tools][heroku-cli]
2.  `heroku login`
3.  Add a git remote for heroku:

[heroku-cli]: https://devcenter.heroku.com/articles/heroku-cli

- **If you are creating a new app...**

  1.  `heroku create` or `heroku create your-app-name` if you have a
      name in mind.
  2.  `heroku addons:create heroku-postgresql:hobby-dev` to add
      ("provision") a postgres database to your heroku dyno

- **If you already have a Heroku app...**

  1.  `heroku git:remote your-app-name` You'll need to be a
      collaborator on the app.

### Travis

_**NOTE**_ that this step assumes that Travis-CI is already testing your code.
Continuous Integration is not about testing per se – it's about _continuously
integrating_ your changes into the live application, instead of periodically
_releasing_ new versions. CI tools can not only test your code, but then
automatically deploy your app. This is known as Continuous Deployment.
Boilermaker comes with a `.travis.yml` configuration almost ready for
continuous deployment; follow these steps to the job.

1.  Run the following commands to create a new branch:

```
git checkout master
git pull
git checkout -b f/travis-deploy
```

2.  Run the following script to finish configuring `travis.yml` :
    `npm run heroku-token`
    This will use your `heroku` CLI (that you configured previously, if
    not then see [above](#Heroku)) to generate an authentication token. It
    will then use `openssl` to encrypt this token using a public key that
    Travis has generated for you. It will then update your `.travis.yml`
    file with the encrypted value to be sent with the `secure` key under
    the `api_key`.
3.  Run the following commands to commit these changes

```
git add .travis.yml
git commit -m 'travis: activate deployment'
git push -u origin f/travis-deploy
```

4.  Make a Pull Request for the new branch, get it approved, and merge it into
    the master branch.

_**NOTE**_ that this script depends on your local `origin` Git remote matching
your GitHub URL, and your local `heroku` remote matching the name of your
Heroku app. This is only an issue if you rename your GitHub organization,
repository name or Heroku app name. You can update these values using
`git remote` and its related commands.

#### Travis CLI

There is a procedure to complete the above steps by installing the official
[Travis CLI tools][travis-cli]. This requires a recent Ruby, but this step
should not be, strictly speaking, necessary. Only explore this option when the
above has failed.

[travis-cli]: https://github.com/travis-ci/travis.rb#installation

That's it! From now on, whenever `master` is updated on GitHub, Travis
will automatically push the app to Heroku for you.

### Cody's own deploy script

Your local copy of the application can be pushed up to Heroku at will,
using Boilermaker's handy deployment script:

1.  Make sure that all your work is fully committed and merged into your
    master branch on Github.
2.  If you currently have an existing branch called "deploy", delete
    it now (`git branch -d deploy`). We will use a dummy branch
    with the name `deploy` (see below), so and the script below will error if a
    branch with that name already exists.
3.  `npm run deploy`
    _ this will cause the following commands to happen in order:
    _ `git checkout -b deploy`: checks out a new branch called
    `deploy`. Note that the name `deploy` here is not magical, but it needs
    to match the name of the branch we specify when we push to our `heroku`
    remote.
    _ `webpack -p`: webpack will run in "production mode"
    _ `git add -f public/bundle.js public/bundle.js.map`: "force" add
    these files which are listed in `.gitignore`.
    _ `git commit --allow-empty -m 'Deploying'`: create a commit, even
    if nothing changed
    _ `git push --force heroku deploy:master`: push your local
    `deploy` branch to the `master` branch on `heroku`
    _ `git checkout master`: return to your master branch
    _ `git branch -D deploy`: remove the deploy branch

Now, you should be deployed!

Why do all of these steps? The big reason is because we don't want our
production server to be cluttered up with dev dependencies like
`webpack`, but at the same time we don't want our development
git-tracking to be cluttered with production build files like
`bundle.js`! By doing these steps, we make sure our development and
production environments both stay nice and clean!

# Project name

<!--- These are examples. See https://shields.io for others or to customize this set of shields. You might want to include dependencies, project status and licence info here --->

![GitHub contributors](https://img.shields.io/github/contributors/nicolerae/README-templateFSA.md)
![GitHub stars](https://img.shields.io/github/stars/nicolerae/README-templateFSA.md?style=social)
![GitHub forks](https://img.shields.io/github/forks/nicolerae/README-templateFSA.md?style=social)
![Twitter Follow](https://img.shields.io/twitter/follow/nicole_rae?style=social)

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://www.fullstackacademy.com/">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvb1JL7ZWrXisAAKRGlhl6AVCmjMQQJAvLCQ&usqp=CAU" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">README-Template</h3>

  <p align="center">
    A README template for your projects that will impress recruiters!
    <br />

Project name is a `<utility/tool/feature>` that allows `<insert_target_audience>` to do `<action/task_it_does>`.

Additional line of information text about what the project does. Your introduction should be around 2 or 3 sentences.
Don't go overboard, people won't read it!

_</b> Image(s) Insert Here_ </b> - here is where you can place images of your project, a demo gif, and link to a deployed site - visuals matter!

<p align='center'><a href="https://www.loom.com/share/04d6c8482c7341fb9b423d10f0bea30b"> <img style="max-width:300px" src="https://cdn.loom.com/sessions/thumbnails/04d6c8482c7341fb9b423d10f0bea30b-with-play.gif"> </br> <p>Watch Video</p> </a></p>

## Prerequisites:

Before you begin, ensure you have met the following requirements:

<!--- These are just example requirements. Add, duplicate or remove as required --->

- You have installed the latest version of `<coding_language/dependency/requirement_1>`
- You have a `<Windows/Linux/Mac>` machine. State which OS is supported/which is not.
- You have read `<guide/link/documentation_related_to_project>`.

## Installing <project_name>:

To install <project_name>, follow these steps:

Linux and macOS:

```
<install_command>
```

Windows:

```
<install_command>
```

## Using <project_name>:

To use <project_name>, follow these steps:

```
<usage_example>
```

Add run commands and examples you think users will find useful.
Provide an options reference for bonus points!

## Contributing to <project_name>:

<!--- If your README is long or you have some specific process or steps you want contributors to follow, consider creating a separate CONTRIBUTING.md file--->

To contribute to <project_name>, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## Contributors/Collaborators:

Thanks to the following people who have contributed to this project:

- [@N2ameOFpersonwhohelpedyou](https://github.com/theirN@me) 📖

You might want to consider using something like the [All Contributors](https://github.com/all-contributors/all-contributors) specification and its [emoji key](https://allcontributors.org/docs/en/emoji-key).

## Roadmap:

If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contact:

If you want to contact me you can reach me at <nicole.drummond@fullstackacademy.com>.

Connect with me on <a href="/linkedin.com/in/nicoleraedrummond">LinkedIN</a>

## License:

<!--- If you're not sure which open license to use see https://choosealicense.com/--->

This project uses the following license: [<license_name>](link).

## Additional Resources:

https://www.makeareadme.com

https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-readmes

https://github.com/scottydocs/README-template.md

https://github.com/kefranabg/readme-md-generator

https://github.com/tkshill
