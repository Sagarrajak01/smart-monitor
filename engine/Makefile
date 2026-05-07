CXX = g++
CXXFLAGS = -Wall -Wextra -O3 -std=c++17
SRC_DIR = src
OBJ_DIR = obj

# Targets
MONITOR_TARGET = smart-monitor
LEAKER_TARGET = leaker

# Source sets
MONITOR_SRCS = $(SRC_DIR)/main.cpp $(SRC_DIR)/Parser.cpp $(SRC_DIR)/Analyzer.cpp
LEAKER_SRCS = $(SRC_DIR)/leaker.cpp

# Object mapping
MONITOR_OBJS = $(MONITOR_SRCS:$(SRC_DIR)/%.cpp=$(OBJ_DIR)/%.o)
LEAKER_OBJS = $(LEAKER_SRCS:$(SRC_DIR)/%.cpp=$(OBJ_DIR)/%.o)

all: $(MONITOR_TARGET) $(LEAKER_TARGET)

# Build the Monitor
$(MONITOR_TARGET): $(MONITOR_OBJS)
	$(CXX) $(CXXFLAGS) -o $(MONITOR_TARGET) $(MONITOR_OBJS)

# Build the Leaker
$(LEAKER_TARGET): $(LEAKER_OBJS)
	$(CXX) $(CXXFLAGS) -o $(LEAKER_TARGET) $(LEAKER_OBJS)

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp
	@mkdir -p $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -rf $(OBJ_DIR) $(MONITOR_TARGET) $(LEAKER_TARGET)

.PHONY: all clean