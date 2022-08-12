import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { PostsService } from '../posts.service';

import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'First Post', content: "This is the first posts's content" },
  //   { title: 'Second Post', content: "This is the second posts's content" },
  //   { title: 'Third Post', content: "This is the third posts's content" },
  // ];
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  isAuth = false;
  userId: string;
  isLoading = false;
  posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [2, 5, 10];
  currentPage = 1;

  constructor(
    private authService: AuthService,
    private postsService: PostsService
  ) {}

  ngOnInit() {
    this.isAuth = this.authService.isAuthenticated;
    this.userId = this.authService.userId;
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);

    this.postsSub = this.postsService.postsUpdated.subscribe(postData => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
    });

    this.authStatusSub = this.authService.authStatusUpdated.subscribe(
      isAuthenticated => {
        this.isAuth = isAuthenticated;
        this.userId = this.authService.userId;
      }
    );
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.isLoading = true;

    this.postsService.deletePost(postId).subscribe(responseData => {
      console.log(responseData.message);
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;

    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
