import java.io.File;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;

public class test {
    public static void main(String[] args) throws Exception {
        File f = new File(System.getProperty("user.home") + "/.m2/repository/org/kohsuke/github-api/1.318/github-api-1.318.jar");
        URL[] urls = { f.toURI().toURL() };
        URLClassLoader cl = new URLClassLoader(urls);
        Class<?> clazz = Class.forName("org.kohsuke.github.GHRepository", true, cl);
        System.out.println("Methods containing 'invit' in GHRepository:");
        for (Method m : clazz.getMethods()) {
            if (m.getName().toLowerCase().contains("invit")) {
                System.out.println(m.getName() + " returns " + m.getReturnType().getName());
            }
        }

        Class<?> inviteClass = Class.forName("org.kohsuke.github.GHInvitation", true, cl);
        System.out.println("\nMethods in GHInvitation:");
        for (Method m : inviteClass.getMethods()) {
            if (m.getDeclaringClass() == inviteClass) {
                System.out.println(m.getName() + " returns " + m.getReturnType().getName());
            }
        }
    }
}
