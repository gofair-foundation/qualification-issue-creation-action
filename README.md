# Qualification Issue Action

This is a custom action to create issues for FAIR supporting resources that need to be curated.

## Process flow

```mermaid
flowchart LR
	start((start))-->pp[[PetaPico API request]]
	pp-->rows[/Unqualified FSRs/]-->set
	start-->gh[[GitHub API]]-->iss[/Issues/]-->set
	subgraph "Per row"
    set{Set\ncomparison\nlogic}
    set -->|Already exists|finish
    set -->|Newly unqualified|create
    set -->|Obsolete|close
    set -->|Prematurely closed|reopen
    finish((end))
	  
	  create[["Create GitHub issue"]]-->finish
	  close[["Close GitHub issue"]]-->finish
	  reopen[["Reopen GitHub issue"]]-->finish
	end
```

## Action usage

The action needs two configuration properties in the env:
  1. _GITHUB_TOKEN_ - use `${{ secrets.GITHUB_TOKEN }}`
  2. _QUERYAPI_ - the KnowledgePixels endpoint

e.g.
```
jobs:
  issue_job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout the template
        uses: actions/checkout@v4
        with:
          sparse-checkout: |
            .github
      - name: Create issues
        uses: gofair-foundation/qualification-issue-creation-action@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          QUERYAPI: https://query.knowledgepixels.com/api/RA7gF4IoWKT3AMIcueQYIRdePPBzF4_htbZ_RTFLmcdds/list_nonqualifed_fsr
```
----
# Development instructions

These are retained from the template project.

## Initial Setup

After you've cloned the repository to your local machine or codespace, you'll
need to perform some initial setup steps before you can develop your action.

> [!NOTE]
>
> You'll need to have a reasonably modern version of
> [Node.js](https://nodejs.org) handy. If you are using a version manager like
> [`nodenv`](https://github.com/nodenv/nodenv) or
> [`nvm`](https://github.com/nvm-sh/nvm), you can run `nodenv install` in the
> root of your repository to install the version specified in
> [`package.json`](./package.json). Otherwise, 20.x or later should work!

1. Install the dependencies

   ```bash
   npm install
   ```

2. Package the JavaScript for distribution

   ```bash
   npm run bundle
   ```

3. Run the tests

   ```bash
   $ npm test
   
   PASS  ./index.test.js
     ✓ throws invalid number (3ms)
     ✓ wait 500 ms (504ms)
     ✓ test runs (95ms)
   
   ...
   ```

## Update the Action Metadata

The [`action.yml`](action.yml) file defines metadata about your action, such as
input(s) and output(s). For details about this file, see
[Metadata syntax for GitHub Actions](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions).

When you copy this repository, update `action.yml` with the name, description,
inputs, and outputs for your action.

## Update the Action Code

The [`src/`](./src/) directory is the heart of your action! 

For more information about the GitHub Actions toolkit, see the [documentation](https://github.com/actions/toolkit/blob/master/README.md).

So, what are you waiting for? Go ahead and start customizing your action!

1. Create a new branch

   ```bash
   git checkout -b releases/v1
   ```

1. Replace the contents of `src/` with your action code
1. Add tests to `__tests__/` for your source code
1. Format, test, and build the action

   ```bash
   npm run all
   ```

   > [!WARNING]
   >
   > This step is important! It will run [`ncc`](https://github.com/vercel/ncc)
   > to build the final JavaScript action code with all dependencies included.
   > If you do not run this step, your action will not work correctly when it is
   > used in a workflow. This step also includes the `--license` option for
   > `ncc`, which will create a license file for all of the production node
   > modules used in your project.

1. Commit your changes

   ```bash
   git add .
   git commit -m "My first action is ready!"
   ```

1. Push them to your repository

   ```bash
   git push -u origin releases/v1
   ```

1. Create a pull request and get feedback on your action
1. Merge the pull request into the `main` branch
1. Create a tag

Your action is now published! 



