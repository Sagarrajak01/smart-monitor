#include "Analyzer.h"
#include <numeric>

Analyzer::Analyzer(int size) : windowSize(size), currentEMA(0.0f), alpha(0.2f) {}

float Analyzer::addSample(long value) {
    if (samples.size() >= windowSize) {
        samples.pop_front();
    }
    samples.push_back(value);

    // EMA Logic
    if (currentEMA == 0.0f) currentEMA = value;
    else currentEMA = (alpha * value) + (1.0f - alpha) * currentEMA;

    return currentEMA;
}

float Analyzer::calculateSlope() {
    if (samples.size() < 2) return 0.0f;

    // Linear Regression slope
    int n = samples.size();
    float sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (int i = 0; i < n; i++) {
        sumX += i;
        sumY += samples[i];
        sumXY += i * samples[i];
        sumX2 += i * i;
    }

    float numerator = (n * sumXY) - (sumX * sumY);
    float denominator = (n * sumX2) - (sumX * sumX);

    return (denominator == 0) ? 0.0f : numerator / denominator;
}