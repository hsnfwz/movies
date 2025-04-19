'use client';
import { useState, useCallback, useEffect } from 'react';

const useIntersection = (threshold = 1) => {
  const [elementIntersected, setElementIntersected] = useState(null);
  const [elementNode, setElementNode] = useState(null);
  const [observer, setObserver] = useState(null);

  const elementRef = useCallback((node) => {
    if (node && node !== elementNode) setElementNode(node);
  }, []);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setElementIntersected(entry);
          } else {
            setElementIntersected(null);
          }
        });
      },
      { threshold }
    );

    setObserver(intersectionObserver);
  }, []);

  useEffect(() => {
    if (!observer || !elementNode) return;

    observer.observe(elementNode);

    return () => {
      observer.unobserve(elementNode);
    };
  }, [elementNode]);

  return [elementRef, elementIntersected];
};

export default useIntersection;
