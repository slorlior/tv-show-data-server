import { Test, TestingModule } from '@nestjs/testing';
import { TvShowResolver } from './tv-show.resolver';

describe('TvShowDataResolver', () => {
  let resolver: TvShowResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TvShowResolver],
    }).compile();

    resolver = module.get<TvShowResolver>(TvShowResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
