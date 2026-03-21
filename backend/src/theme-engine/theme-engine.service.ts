import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ThemeEngineService {
  constructor(private prisma: PrismaService) {}

  async calculateScore(userId: string, themeCode: string) {
    // Logic to fetch normalized data and apply weights
    // This is the "Decision Engine" in the backend
    const measurements = await this.prisma.normalizedMeasurement.findMany({
      where: { session: { userId }, code: { in: ['energy_marker_1', 'energy_marker_2'] } },
      orderBy: { capturedAt: 'desc' },
      take: 10,
    });

    let score = 50; // Default
    if (measurements.length > 0) {
      // Logic simulation
      score = 64; 
    }

    const theme = await this.prisma.themeDefinition.findUnique({
      where: { code: themeCode },
    });

    if (!theme) return null;

    const themeScore = await this.prisma.themeScore.create({
      data: {
        userId,
        definitionId: theme.id,
        value: score,
        stateLabel: score > 60 ? 'moderado' : 'fraco',
        band: 'functional',
        version: '1.0',
        confidence: 85,
        dataWindow: { period: '7d' },
      },
    });

    // Generate Insight (Language Engine)
    await this.prisma.themeInsight.create({
      data: {
        userId,
        scoreId: themeScore.id,
        summaryShort: 'A tua energia está estável.',
        explanationLong: 'Com base nos teus biomarcadores de hidratação e sono, a tua prontidão funcional é positiva.',
        explanationFactors: { hydration: 'good', sleep: 'fair' },
        language: 'pt-PT',
        version: '1.0',
        tone: 'clinical',
      },
    });

    return themeScore;
  }

  async getUserThemes(userId: string) {
    return this.prisma.themeScore.findMany({
      where: { userId },
      include: { definition: true, insights: true },
      orderBy: { generatedAt: 'desc' },
    });
  }
}
