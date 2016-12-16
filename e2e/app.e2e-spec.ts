import { ProjectTrackerPage } from './app.po';

describe('project-tracker App', function() {
  let page: ProjectTrackerPage;

  beforeEach(() => {
    page = new ProjectTrackerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
