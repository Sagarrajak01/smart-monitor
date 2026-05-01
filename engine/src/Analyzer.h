#ifndef ANALYZER_H
#define ANALYZER_H

#include <deque>
#include <vector>

class Analyzer {
public:
    Analyzer(int windowSize = 60);
    
    // Adds a new data point and returns the smoothed value
    float addSample(long value);
    
    // Calculates the slope (trend) using simple linear regression
    float calculateSlope();

private:
    int windowSize;
    std::deque<long> samples;
    float currentEMA;
    float alpha; // Smoothing factor for EMA
};

#endif