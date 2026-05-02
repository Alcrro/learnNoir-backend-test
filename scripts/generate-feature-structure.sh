#!/bin/bash

FEATURE_NAME="$1"

if [ -z "$FEATURE_NAME" ]; then
  echo "Usage: ./create-feature.sh <feature-name>"
  exit 1
fi

BASE_PATH="src/features/$FEATURE_NAME"

if [ -d "$BASE_PATH" ]; then
  echo "Feature already exists."
  exit 1
fi

mkdir -p "$BASE_PATH/application/useCases"
mkdir -p "$BASE_PATH/application/dto"
mkdir -p "$BASE_PATH/application/composition"

mkdir -p "$BASE_PATH/domain/entities"
mkdir -p "$BASE_PATH/domain/repositories"
mkdir -p "$BASE_PATH/domain/types"
mkdir -p "$BASE_PATH/domain/valueObjects"

mkdir -p "$BASE_PATH/infrastructure/db"
mkdir -p "$BASE_PATH/infrastructure/mapper"
mkdir -p "$BASE_PATH/infrastructure/cache"

mkdir -p "$BASE_PATH/interfaces/controller"
mkdir -p "$BASE_PATH/interfaces/routes"

echo "Feature '$FEATURE_NAME' created."