<div class="ns-likes">
    <!-- IF !reputation:disabled -->
    <div class="btn-group">
        <button component="ns/likes/toggle" type="button" class="btn btn-default btn-xs ns-likes-toggle <!-- IF posts.upvoted -->upvoted<!-- ENDIF posts.upvoted -->">
            <!-- IF posts.upvoted -->
            Unlike
            <!-- ELSE -->
            Like
            <!-- ENDIF posts.upvoted -->
        </button>
        <button component="ns/likes/vote-count" type="button" class="btn btn-default btn-xs ns-likes-votes" data-votes="{posts.votes}">
            {posts.votes}
        </button>
    </div>
    <!-- ENDIF !reputation:disabled -->
</div>