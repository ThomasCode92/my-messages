import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';

import { Post } from '../post.model';

import { mimeType } from './mime-type.validator';

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
  imagePreview: string;
  post: Post;
  form: FormGroup;

  constructor(
    private sanitizer: DomSanitizer,
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
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
            image: this.post.imagePath,
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
    const image = this.form.value.image;

    if (this.mode === 'create') {
      this.postsService.addPost(title, content, image);
    }

    if (this.mode === 'edit') {
      this.postsService.updatePost(this.postId, title, content, image);
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const inputElement = <HTMLInputElement>event.target;
    const file = inputElement.files[0];

    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();

    reader.onload = () => {
      const readerResult = <string>reader.result;
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(readerResult);

      this.imagePreview = <string>url;
    };

    reader.readAsDataURL(file);
  }
}
