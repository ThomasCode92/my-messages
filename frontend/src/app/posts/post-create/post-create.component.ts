import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';

import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  private mode: 'create' | 'edit' = 'create';
  private postId: string;

  isLoading = false;
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  form: FormGroup;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;

        this.postsService.getPost(this.postId).subscribe(postData => {
          console.log(postData.message);

          this.isLoading = false;
          this.post = postData.post;

          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) return;

    this.isLoading = true;

    const title = this.form.value.title;
    const content = this.form.value.content;

    if (this.mode === 'create') {
      this.postsService.addPost(title, content);
    }

    if (this.mode === 'edit') {
      this.postsService.updatePost(this.postId, title, content);
    }

    this.form.reset();
  }
}
