export class Movie {
  constructor(
    private id: string,
    private title: string,
    private duration: number,
    private createdAt: string
  ) {}

  getId(): string {
    return this.id;
  }
  public setId(newId: string): void {
    this.id = newId;
  }

  getTitle(): string {
    return this.title;
  }
  public setTitle(newTitle: string): void {
    this.title = newTitle;
  }

  getDuration(): number {
    return this.duration;
  }
  public setDuration(newDuration: number): void {
    this.duration = newDuration;
  }

  getCreatedAt(): string {
    return this.createdAt;
  }

  
  get _id() : string {
    return this.id
  }
  
  set _id(v : string) {
    this.id = v;
  }

  get _title() : string {
    return this.title
  }
  
  set _title(v : string) {
    this.title = v;
  }
  
  get _duration() : number {
    return this.duration
  }
  
  set _duration(v : number) {
    this.duration = v;
  }

  get _createdAt() : string {
    return this.createdAt
  }
}
