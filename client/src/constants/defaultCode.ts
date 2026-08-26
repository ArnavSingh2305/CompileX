export const DEFAULT_CODE: Record<string, string> = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, CompileX!" << endl;
    return 0;
}`,
  python: `print("Hello, CompileX!")`,
};

export const LANGUAGE_OPTIONS = [
  { label: "C++", value: "cpp", monacoLang: "cpp" },
  { label: "Python", value: "python", monacoLang: "python" },
];