<div class="ns-likes">
    <!-- IF !reputation:disabled -->
    <div class="btn-group">
        <button component="ns/likes/toggle" type="button" class="brn btn-default btn-xs <!-- IF posts.upvoted -->upvoted<!-- ENDIF posts.upvoted --> ns-likes-toggle">
            <!-- IF posts.upvoted -->
            Unlike
            <!-- ELSE -->
            Like
            <!-- ENDIF posts.upvoted -->
        </button>
        <button component="ns/likes/vote-count" type="button" class="btn-default btn-xs ns-likes-votes" data-votes="{posts.votes}">
            {posts.votes}
        </button>
    </div>
    <!-- ENDIF !reputation:disabled -->
</div>