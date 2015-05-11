<div class="ns-likes">
    <!-- IF !reputation:disabled -->
    <div component="ns/likes/users" class="ns-likes-users"></div>
    <div class="btn-group">
        <button component="ns/likes/toggle" type="button" class="btn btn-default btn-xs ns-likes-toggle <!-- IF posts.upvoted -->liked<!-- ENDIF posts.upvoted -->">
            <!-- IF posts.upvoted -->
            Unlike
            <!-- ELSE -->
            Like
            <!-- ENDIF posts.upvoted -->
        </button>
        <button component="ns/likes/count" type="button" class="btn btn-default btn-xs ns-likes-votes" data-likes="{posts.votes}">
            {posts.votes}
        </button>
    </div>
    <!-- ENDIF !reputation:disabled -->
</div>