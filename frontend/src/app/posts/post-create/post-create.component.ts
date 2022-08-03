import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';

import { Post } from '../post.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  private mode: 'create' | 'edit' = 'create';
  private postId: string;

  enteredTitle = '';
  enteredContent = '';
  post: Post;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
          console.log(postData.message);

          this.post = postData.post;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) return;

    const title = form.value.title;
    const content = form.value.content;

    if (this.mode === 'create') {
      this.postsService.addPost(title, content);
    }

    if (this.mode === 'edit') {
      this.postsService.updatePost(this.postId, title, content);
    }

    form.resetForm();
  }
}
