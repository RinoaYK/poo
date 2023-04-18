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
}
