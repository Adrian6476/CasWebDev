// src/services/ConfigService.ts
import yaml from 'js-yaml';

export class ConfigService {
  private static instance: ConfigService;
  public languages: { [key: string]: string } = {};
  public defaultLang: string = 'en-US';
  public landingPage: string = 'welcome';

  private constructor() {}

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public async loadConfig(): Promise<void> {
    try {
      const response = await fetch('/src/app/doc/toc.yaml');
      const yamlText = await response.text();
      const parsedYaml: any = yaml.load(yamlText);

      if (parsedYaml && parsedYaml.config) {
        this.languages = parsedYaml.config.lang || {};
        this.defaultLang = parsedYaml.config['lang-default'] || 'en-US';
      }

      if (parsedYaml && parsedYaml.docs) {
        this.landingPage = parsedYaml.docs.landing || 'welcome';
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  }
}
