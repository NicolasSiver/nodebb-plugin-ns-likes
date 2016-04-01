# NodeBB: Likes

Traditional Like system, as you can find on social networks. It uses same reputation system.

![Version](https://img.shields.io/npm/v/nodebb-plugin-ns-likes.svg)
![Dependencies](https://david-dm.org/NicolasSiver/nodebb-plugin-ns-likes.svg)
![bitHound Score](https://www.bithound.io/github/NicolasSiver/nodebb-plugin-ns-likes/badges/score.svg)
![Code Climate](https://img.shields.io/codeclimate/github/NicolasSiver/nodebb-plugin-ns-likes.svg)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
 

- [Themes](#themes)
- [View](#view)
- [TODO](#todo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Themes

Installation of plugin is pretty straightforward. You should add template import to `Post Template`. For example, you can find `post template` for **Persona Theme** under this path: `nodebb-theme-persona/templates/partials/topic/post.tpl`

Import:

    <!-- IMPORT partials/topic/likes_post.tpl -->
    
Add it wherever you like, but don't forget to delete default one, with chevrons.

## View

By default, it looks like:

![White Bootstrap Theme](screenshot.png)

Additional list:

![Floating Window](screenshot2.png)

## TODO 

- Another style for zero votes
- Update user list if It's opened
- Don't show toggle-button for personal content
