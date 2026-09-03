<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_a_project_with_images(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->post('/api/projects', [
            'title' => 'Upload Test Project',
            'short_description' => 'A project used to verify image uploads.',
            'description' => 'Full project description.',
            'status' => 'published',
            'sort_order' => 0,
            'is_featured' => true,
            'is_purchasable' => false,
            'demo_url' => 'https://demo.example.com',
            'demo_email' => 'recruiter@example.com',
            'demo_password' => 'demo-password',
            'thumbnail' => UploadedFile::fake()->image('thumbnail.jpg', 1200, 750),
            'images' => [
                ['file' => UploadedFile::fake()->image('screen.jpg', 1200, 750), 'alt_text' => 'Project screen'],
            ],
        ]);

        $response->assertCreated()
            ->assertJsonPath('title', 'Upload Test Project')
            ->assertJsonPath('has_demo_credentials', true)
            ->assertJsonCount(1, 'images');

        $this->assertDatabaseHas('projects', [
            'slug' => 'upload-test-project',
            'demo_email' => 'recruiter@example.com',
            'demo_password' => 'demo-password',
        ]);
        $this->assertDatabaseCount('project_images', 1);

        $this->get('/api/projects/upload-test-project')
            ->assertOk()
            ->assertJsonPath('demo_email', 'recruiter@example.com')
            ->assertJsonPath('demo_password', 'demo-password');

        $this->get('/api/projects')
            ->assertOk()
            ->assertJsonMissingPath('0.demo_email')
            ->assertJsonMissingPath('0.demo_password')
            ->assertJsonPath('0.has_demo_credentials', true);
    }

    public function test_project_accepts_the_documented_500_character_short_description(): void
    {
        $user = User::factory()->create();
        $summary = str_repeat('a', 500);

        $response = $this->actingAs($user, 'sanctum')->post('/api/projects', [
            'title' => 'Detailed Summary Project',
            'short_description' => $summary,
            'description' => 'Full project description.',
            'status' => 'draft',
            'sort_order' => 0,
            'is_featured' => false,
            'is_purchasable' => false,
        ]);

        $response->assertCreated()
            ->assertJsonPath('short_description', $summary);

        $this->assertDatabaseHas('projects', [
            'slug' => 'detailed-summary-project',
            'short_description' => $summary,
        ]);
    }
}
