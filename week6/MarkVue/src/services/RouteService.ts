// week6/MarkVue/src/services/RouteService.ts

import yaml from 'js-yaml';
import { ConfigService } from './ConfigService';

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
  private configService = ConfigService.getInstance();

  private constructor() {}

  public static getInstance(): RouteService {
    if (!RouteService.instance) {
      RouteService.instance = new RouteService();
    }
    return RouteService.instance;
  }

  public async generateRoutes(): Promise<any[]> {
    try {
      const parsedYaml = await this.loadTocYaml();

      if (parsedYaml && parsedYaml.docs && parsedYaml.docs.chapters) {
        this.routes = this.processChapters(parsedYaml.docs.chapters);
      }

      return this.routes;
    } catch (error) {
      console.error('Error generating routes:', error);
      return [];
    }
  }

  private async loadTocYaml(): Promise<any> {
    try {
      const response = await fetch('/src/app/doc/toc.yaml');
      const yamlText = await response.text();
      return yaml.load(yamlText);
    } catch (error) {
      console.error('Error loading toc.yaml:', error);
      return null;
    }
  }

  private processChapters(chapters: DocItem[]): any[] {
    const routes: any[] = [];
    const languages = this.configService.languages;

    for (const langCode in languages) {
      for (const item of chapters) {
        routes.push(...this.generateRoutesForItem(item, langCode));
      }
    }

    return routes;
  }

  private generateRoutesForItem(item: DocItem, lang: string): any[] {
    const routes: any[] = [];

    if (item.type === 'doc' || item.type === 'chapter') {
      routes.push({
        path: `/${lang}/${item.id}`,
        name: `${lang}-${item.id}`,
        component: () => import('../components/DocumentViewer.vue'),
        props: { docId: item.id, lang },
      });

      if (item.sub) {
        for (const subItem of item.sub) {
          routes.push(...this.generateRoutesForItem(subItem, lang));
        }
      }
    }

    return routes;
  }

  public getDefaultLang(): string {
    return this.configService.defaultLang;
  }

  public getLandingPageRoute(lang: string): string {
    return `/${lang}/${this.configService.landingPage}`;
  }
}
