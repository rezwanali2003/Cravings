from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    author = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    content = models.TextField()
    photo = models.ImageField(upload_to='post_photos/', blank=True, null=True)  # Added photo field
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def like_count(self):
        return self.interactions.filter(interaction_type='like').count()

    def dislike_count(self):
        return self.interactions.filter(interaction_type='dislike').count()

    def __str__(self):
        return f"{self.title} by {self.author}"


class PostInteraction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post_interactions")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="interactions")
    interaction_type = models.CharField(max_length=10, choices=[('like', 'Like'), ('dislike', 'Dislike')])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

    def __str__(self):
        return f"{self.user.username} {self.interaction_type}d {self.post.title}"


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    reply_to_user = models.ForeignKey(User, null=True, blank=True, related_name='replied_comments', on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.username}: {self.content[:20]}"



