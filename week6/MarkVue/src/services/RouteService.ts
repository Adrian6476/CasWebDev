import yaml from 'js-yaml';

interface DocItem {
  id: string;
  type: string;
  name: string;
  file?: string;
  sub?: DocItem[];
}

export class RouteService {
  private static instance: RouteService;
  private routes: any[] = [];

  private constructor() {}

  public static getInstance(): RouteService {
    if (!RouteService.instance) {
      RouteService.instance = new RouteService();
    }
    return RouteService.instance;
  }

  public async generateRoutes(): Promise<any[]> {
    try {
      const response = await fetch('/src/app/doc/toc.yaml');
      const yamlText = await response.text();
      const parsedYaml: any = yaml.load(yamlText);

      if (parsedYaml && parsedYaml.docs && parsedYaml.docs.chapters) {
        this.routes = this.processChapters(parsedYaml.docs.chapters);
      }

      return this.routes;
    } catch (error) {
      console.error('Error generating routes:', error);
      return [];
    }
  }

  private processChapters(chapters: DocItem[]): any[] {
    const routes: any[] = [];

    for (const item of chapters) {
      if (item.type === 'doc' || item.type === 'chapter') {
        routes.push({
          path: `/${item.id}`,
          name: item.id,
          component: () => import('../components/DocumentViewer.vue'),
          props: { docId: item.id }
        });

        if (item.sub) {
          routes.push(...this.processChapters(item.sub));
        }
      }
    }

    return routes;
  }
}