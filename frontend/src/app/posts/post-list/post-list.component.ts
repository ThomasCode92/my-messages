import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

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

  posts: Post[] = [];

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.postsService.posts;

    this.postsSub = this.postsService.postsUpdated.subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      }
    );
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
