from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Post, PostInteraction
from users.models import Follow

from .serializers import PostSerializer, CommentSerializer
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.http import JsonResponse



@api_view(['POST'])
def like_post(request, post_id):
    user = request.user
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    # Check if the user has already liked or disliked the post
    existing_interaction = PostInteraction.objects.filter(user=user, post=post)

    if existing_interaction.exists():
        interaction = existing_interaction.first()
        if interaction.interaction_type == 'like':
            # Unlike the post
            interaction.delete()
            return Response({"message": "You have unliked the post."}, status=status.HTTP_200_OK)
        else:
            # Remove dislike and add like
            interaction.interaction_type = 'like'
            interaction.save()
            return Response({"message": "You have liked the post."}, status=status.HTTP_200_OK)
    else:
        # Create new like interaction
        PostInteraction.objects.create(user=user, post=post, interaction_type='like')
        return Response({"message": "You have liked the post."}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def dislike_post(request, post_id):
    user = request.user
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    # Check if the user has already liked or disliked the post
    existing_interaction = PostInteraction.objects.filter(user=user, post=post)

    if existing_interaction.exists():
        interaction = existing_interaction.first()
        if interaction.interaction_type == 'dislike':
            # Remove dislike
            interaction.delete()
            return Response({"message": "You have undisliked the post."}, status=status.HTTP_200_OK)
        else:
            # Remove like and add dislike
            interaction.interaction_type = 'dislike'
            interaction.save()
            return Response({"message": "You have disliked the post."}, status=status.HTTP_200_OK)
    else:
        # Create new dislike interaction
        PostInteraction.objects.create(user=user, post=post, interaction_type='dislike')
        return Response({"message": "You have disliked the post."}, status=status.HTTP_201_CREATED)



@api_view(['POST'])
def create_post(request):
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    title = request.data.get('title')
    content = request.data.get('content')
    photo = request.FILES.get('photo')  # Accept photo file

    author = request.user.username

    if not title or not content:
        return Response({'detail': 'Title and content are required.'}, status=status.HTTP_400_BAD_REQUEST)

    post = Post.objects.create(user=request.user, title=title, content=content, author=author, photo=photo)

    serializer = PostSerializer(post, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
def update_post(request, post_id):
    try:
        # Filter by user for authorization
        post = Post.objects.get(id=post_id, user=request.user)
    except Post.DoesNotExist:
        return Response({"error": "Post not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)

    serializer = PostSerializer(post, data=request.data, partial=True, context={'request': request})

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





@api_view(['GET'])
def get_all_posts(request):
    posts = Post.objects.all().order_by('-created_at')  # Fetch all posts ordered by creation time
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def post_interaction_status(request, post_id):
    user = request.user

    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    # Check if the user has interacted with the post
    interaction = PostInteraction.objects.filter(user=user, post=post).first()

    if interaction:
        return Response({"interaction_type": interaction.interaction_type}, status=status.HTTP_200_OK)
    else:
        return Response({"interaction_type": None}, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def get_user_posts(request):
    user = request.user  # Get the currently authenticated user

    if not user.is_authenticated:
        return Response({"error": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)

    posts = user.posts.all().order_by('-created_at')  # Fetch the user's posts
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['DELETE'])
def delete_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id, author=request.user)
    except Post.DoesNotExist:
        return Response({"error": "Post not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)

    post.delete()
    return Response({"message": "Post deleted successfully."}, status=status.HTTP_200_OK)



# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def user_profile(request, user_id):
#     try:
#         user = User.objects.get(id=user_id)
#         is_following = Follow.objects.filter(follower=request.user, followed=user).exists()
#         data = {
#             'username': user.username,
#             'email': user.email,
#             'followers_count': user.followers.count(),
#             'following_count': user.following.count(),
#             'is_following': is_following,
#         }
#         return Response(data)
#     except User.DoesNotExist:
#         return Response({'error': 'User not found'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        is_following = Follow.objects.filter(follower=request.user, followed=user).exists()
        followers_count = Follow.objects.filter(followed=user).count()
        following_count = Follow.objects.filter(follower=user).count()

        data = {
            'username': user.username,
            'email': user.email,
            'followers_count': followers_count,
            'following_count': following_count,
            'is_following': is_following,
        }
        return Response(data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)



# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def follow_unfollow(request, user_id):
#     try:
#         user = User.objects.get(id=user_id)
#         if user == request.user:
#             return Response({'error': 'You cannot follow/unfollow yourself'}, status=400)

#         follow_relation, created = Follow.objects.get_or_create(follower=request.user, followed=user)
#         if not created:
#             follow_relation.delete()
#             return Response({'message': 'Unfollowed successfully'})
#         return Response({'message': 'Followed successfully'})
#     except User.DoesNotExist:
#         return Response({'error': 'User not found'}, status=404)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_unfollow(request, user_id):
    try:
        user_to_follow = User.objects.get(id=user_id)

        if user_to_follow == request.user:
            return Response({'error': 'You cannot follow/unfollow yourself'}, status=400)

        follow_relation, created = Follow.objects.get_or_create(follower=request.user, followed=user_to_follow)

        if not created:
            follow_relation.delete()
            return Response({'message': 'Unfollowed successfully'})
        
        return Response({'message': 'Followed successfully'})

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


    

@api_view(['GET'])
def get_comments(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
        comments = post.comments.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def add_comment(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    parent_id = request.data.get('parent')
    parent_comment = Comment.objects.filter(id=parent_id).first() if parent_id else None
    reply_to_user = parent_comment.author if parent_comment else None

    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(post=post, author=request.user, parent=parent_comment, reply_to_user=reply_to_user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




def user_posts(request, user_id):
    user = get_object_or_404(User, id=user_id)
    # Get all posts associated with this user
    posts = Post.objects.filter(user=user)
    posts_data = [
        {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'created_at': post.created_at.isoformat(),  
        }
        for post in posts
    ]
    
    # Return a JsonResponse with posts data
    return JsonResponse({'posts': posts_data})