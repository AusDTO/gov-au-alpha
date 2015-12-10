We begin each project or stage of a project with a Sprint Zero to allow us to define our tools and processes and common goals.

We list initial ideas on cards. We supplement each card as a team by giving it a user story and definition of done.

When reporting a change or bug, we include a screenshot and URL wherever possible.
 
We use *nix based systems, predominately Macbook Pros for development and Cloud Foundary buildpack based systems in deployed environments. We use clever modern code editors like IDEA IntelliJ, Atom or Sublime Text. We use SASS for style sheets and Bootstrap/Semantic UI as component frameworks.

When we work on a new feature, we create a feature branch in the main repository so any changes by others can be done directly. [As we work, we merge in new changes using a rebase.](https://gist.github.com/aussielunix/59957626d6eace17be64)

We try to maintain idiomatic work practices through the use of standards when creating [Commit messages](http://chris.beams.io/posts/git-commit/), [Ruby code](https://github.com/styleguide/ruby), [Python code](https://www.python.org/dev/peps/pep-0008/) and [CSS+HTML](http://primercss.io/guidelines/). 
We use validation tools like WebAIM WAVE to check our work along with user research.

When a feature branch is done, we always ensure at least one other person reviews that branch.  
When we review a branch, we validate and verify. Validate by ensuring code style/conventions are followed and we understand what the change consists of. 
Verify by comparing what the change says it does with the initial idea and the actual results.

When a feature branch is merged, we immediately begin a build in our staging environment. If there is a problem with the build, we let others know in the team chat and ensure that it is resolved as soon as possible.

Every week we conduct a retrospective with the whole team. When in the retrospective, we remind each other of the prime directive: 

> "Regardless of what we discover, we understand and truly believe that everyone did the best job they could, given what they knew at the time, their skills and abilities, the resources available, and the situation at hand."
