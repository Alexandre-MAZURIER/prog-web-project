import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { SunIcon, MoonIcon } from '@modulz/radix-icons';

export const DarkThemeIcon = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <ActionIcon
            variant="filled"
            color={dark ? 'yellow' : 'blue'}
            radius="lg"
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
        >
            {dark ? (
                <SunIcon style={{ width: 18, height: 18 }} />
            ) : (
                <MoonIcon style={{ width: 18, height: 18 }} />
            )}
        </ActionIcon>
    );
}