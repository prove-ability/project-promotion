import React from "react";
import { getComponent } from "./registry";
import type { PageComponent, PageData } from "./types";

interface ComponentRendererProps {
  component: PageComponent;
}

function ComponentRenderer({ component }: ComponentRendererProps) {
  const definition = getComponent(component.type);

  if (!definition) {
    return null;
  }

  const Component = definition.component;
  return <Component {...component.props} />;
}

interface PageRendererProps {
  pageData: PageData;
}

export function PageRenderer({ pageData }: PageRendererProps) {
  return (
    <>
      {pageData.components.map((component) => (
        <ComponentRenderer key={component.id} component={component} />
      ))}
    </>
  );
}
