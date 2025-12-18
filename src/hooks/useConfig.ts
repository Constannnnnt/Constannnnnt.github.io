import { useQuery } from '@tanstack/react-query';
import { loadConfig, Config } from '@/lib/config';

export const useConfig = () => {
    return useQuery<Config>({
        queryKey: ['config'],
        queryFn: loadConfig,
        staleTime: 0, // Disable stale cache for config during development
    });
};
