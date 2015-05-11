<div class="ns-likes">
    <!-- IF !reputation:disabled -->
    <div class="btn-group">
        <button component="ns/likes/toggle" type="button" class="brn btn-default btn-xs <!-- IF posts.upvoted -->upvoted<!-- ENDIF posts.upvoted -->">
            Like
        </button>
        <button component="ns/likes/vote-count" type="button" class="btn-default btn-xs" data-votes="{posts.votes}">
            {posts.votes}
        </button>
    </div>
    <!-- ENDIF !reputation:disabled -->
</div>