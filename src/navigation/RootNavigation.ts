import { createNavigationContainerRef } from '@react-navigation/native';
import { AppStackParamList } from './AppNavigator';

export const navigationRef = createNavigationContainerRef<AppStackParamList>();

export function navigate<RouteName extends keyof AppStackParamList>(
  name: RouteName,
  params: AppStackParamList[RouteName],
) {
  if (navigationRef.isReady()) {
    (navigationRef as unknown as { navigate: (route: string, p: unknown) => void }).navigate(String(name), params);
  }
}
