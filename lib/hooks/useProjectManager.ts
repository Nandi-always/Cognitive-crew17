import { useState, useCallback } from 'react';

export interface ProjectData {
  id: string;
  name: string;
  area: number;
  bhk: number;
  style: string;
  layout: any;
  variants?: any;
  scores?: any;
  createdAt: string;
  updatedAt: string;
}

export function useProjectManager() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = useCallback(
    async (userId: string, name: string, area: number, bhk: number, style: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, name, area, bhk, style }),
        });

        if (!res.ok) throw new Error('Failed to create project');
        return (await res.json()) as ProjectData;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getProject = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to fetch project');
      return (await res.json()) as ProjectData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserProjects = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects?userId=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to fetch projects');
      return (await res.json()) as ProjectData[];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (projectId: string, updates: Partial<ProjectData>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error('Failed to update project');
      return (await res.json()) as ProjectData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveLayout = useCallback(
    async (projectId: string, layout: any, computeScore: boolean = false) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/projects/${projectId}/layout`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ layout, computeScore }),
        });

        if (!res.ok) throw new Error('Failed to save layout');
        return await res.json();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getLayout = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/layout`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to fetch layout');
      return await res.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to delete project');
      return (await res.json()) as ProjectData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createProject,
    getProject,
    getUserProjects,
    updateProject,
    saveLayout,
    getLayout,
    deleteProject,
  };
}
