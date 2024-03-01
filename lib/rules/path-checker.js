"use strict";

const path = require('path');

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Rule FSD for Maia Helper",
      category: "Fill me in",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const importTo = node.source.value;

        const fromFilename = context.getFilename();

        if (shouldBeRelative(fromFilename, importTo)) {
          context.report(node, 'Inside One Slice import should be related!');
        }
      }
    };
  },
};

const layers = {
  // '01_app': '01_app',
  '02_pages': '02_pages',
  '03_widgets': '03_widgets',
  '04_features': '04_features',
  '05_entities': '05_entities',
  // '06_shared': '06_shared',
}

function isPathRelative(path) {
  return path === '.' || path.startsWith('./') || path.startsWith('../')
}

function shouldBeRelative(from, to) {
  if(isPathRelative(to)) {
    return false;
  }

  // example entities/Article
  const toArray = to.split('/')
  const toLayer = toArray[0]; // entities
  const toSlice = toArray[1]; // Article

  if(!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const normalizedPath = path.toNamespacedPath(from);

  const isWindowsOS = normalizedPath.includes('\\');

  const projectFrom = normalizedPath.split('src')[1];
  const fromArray = projectFrom.split(isWindowsOS ? '\\' : '/');

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if(!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;
}